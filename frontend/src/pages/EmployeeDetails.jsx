import React, { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import LoadingState from '../components/LoadingState'
import EmployeeProfileCard from '../components/EmployeeProfileCard'
import SalaryUpdateDialog from '../components/SalaryUpdateDialog'
import SalaryHistoryTable from '../components/SalaryHistoryTable'
import EmployeeForm from '../components/EmployeeForm'

const EmployeeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', id] })
      setFormSuccess(true)
      setFormError(null)
      setTimeout(() => {
        setEditDialogOpen(false)
        setFormSuccess(false)
      }, 1500)
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || 'Failed to update employee. Please try again.')
      setFormSuccess(false)
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

  const handleEditDialogOpen = useCallback(() => {
    setFormSuccess(false)
    setFormError(null)
    setEditDialogOpen(true)
  }, [])

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false)
    setFormSuccess(false)
    setFormError(null)
  }, [])

  const handleEditSubmit = useCallback((data) => {
    updateMutation.mutate({ id, data })
  }, [updateMutation, id])

  const handleUpdateSalary = () => {
    setOpenSalaryDialog(true)
  }

  if (isLoading) {
    return <LoadingState />
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
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 } ,maxWidth: '100vw',}}>
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
          sx={{ 
            mr: { sm: 2 }, 
            alignSelf: { xs: 'flex-start', sm: 'center' },
            color: '#64748B',
            maxWidth: '200px',
            borderColor: '#E2E8F0',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
              borderColor: '#CBD5E1',
            },
          }}
        >
          Back to Employees
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
        {/* Profile Card - Full width on mobile, 9/12 on desktop */}
        <Grid item xs={12} md={9}>
          <EmployeeProfileCard 
            employee={employee} 
            onEdit={handleEditDialogOpen}
            onUpdateSalary={handleUpdateSalary}
          />
        </Grid>

        {/* Salary History Table - Full width */}
        <Grid item xs={12}>
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

      {/* Edit Employee Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: { maxHeight: '90vh', borderRadius: isMobile ? 0 : 2, display: 'flex', flexDirection: 'column' },
        }}
      >
        <DialogTitle fontWeight={600} sx={{ flexShrink: 0 }}>Edit Employee</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
            <EmployeeForm
              mode="edit"
              initialData={{
                employee_id: employee.employee_id,
                name: employee.name,
                email: employee.email,
                department: employee.department,
                designation: employee.designation,
                country: employee.country,
                salary: employee.salary,
                currency: employee.currency,
                joining_date: employee.joining_date?.split('T')[0] || '',
                is_active: employee.is_active,
              }}
              onSubmit={handleEditSubmit}
              onCancel={handleEditDialogClose}
              isLoading={updateMutation.isPending}
              error={formError}
              success={formSuccess}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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