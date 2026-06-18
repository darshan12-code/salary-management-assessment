import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import Loading from '../components/Loading'
import EmployeeProfileCard from '../components/EmployeeProfileCard'
import SalaryCard from '../components/SalaryCard'
import SalaryUpdateDialog from '../components/SalaryUpdateDialog'
import SalaryHistoryTable from '../components/SalaryHistoryTable'

const EmployeeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const { data: employee, isLoading, error: fetchError, refetch: refetchEmployee } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id),
  })

  const {
    data: salaryHistory,
    isLoading: salaryHistoryLoading,
    error: salaryHistoryError,
    refetch: refetchSalaryHistory,
  } = useQuery({
    queryKey: ['salaryHistory', id],
    queryFn: () => employeeService.getSalaryHistory(id),
    enabled: !!employee,
  })

  const updateSalaryMutation = useMutation({
    mutationFn: (salary) => employeeService.updateSalary(id, salary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      queryClient.invalidateQueries({ queryKey: ['salaryHistory', id] })
      setOpenSalaryDialog(false)
      setNotification({
        open: true,
        message: 'Salary updated successfully!',
        severity: 'success',
      })
    },
    onError: (err) => {
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Failed to update salary',
        severity: 'error',
      })
    },
  })

  const handleSalaryUpdate = (salary) => {
    updateSalaryMutation.mutate(salary)
  }

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false })
  }

  const handleRetryEmployee = () => {
    refetchEmployee()
  }

  const handleRetrySalaryHistory = () => {
    refetchSalaryHistory()
  }

  const handleEditEmployee = () => {
    navigate(`/employees/${id}/edit`)
  }

  const handleUpdateSalary = () => {
    setOpenSalaryDialog(true)
  }

  if (isLoading) {
    return <Loading />
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ mb: 2 }}
        >
          Back to Employees
        </Button>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetryEmployee}>
              Retry
            </Button>
          }
        >
          Error loading employee details: {fetchError.message}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ mr: { sm: 2 }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Back to Employees
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          Employee Details
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6} lg={4}>
          <EmployeeProfileCard employee={employee} onEdit={handleEditEmployee} />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <SalaryCard employee={employee} onUpdateSalary={handleUpdateSalary} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ height: '100%' }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                onClick={handleEditEmployee}
              >
                Edit Employee
              </Button>
              <Button
                variant="contained"
                fullWidth={isMobile}
                onClick={handleUpdateSalary}
              >
                Update Salary
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom sx={{ mt: 2 }}>
            Salary History
          </Typography>
          <SalaryHistoryTable
            salaryHistory={salaryHistory}
            currency={employee.currency}
            isLoading={salaryHistoryLoading}
            error={salaryHistoryError}
            onRetry={handleRetrySalaryHistory}
          />
        </Grid>
      </Grid>

      <SalaryUpdateDialog
        open={openSalaryDialog}
        onClose={() => setOpenSalaryDialog(false)}
        onSubmit={handleSalaryUpdate}
        currentSalary={employee.salary}
        currency={employee.currency}
        isLoading={updateSalaryMutation.isPending}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EmployeeDetails
