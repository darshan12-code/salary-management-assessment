import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import Loading from '../components/Loading'

const EmployeeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [openSalaryDialog, setOpenSalaryDialog] = useState(false)
  const [newSalary, setNewSalary] = useState('')
  const [error, setError] = useState('')

  const { data: employee, isLoading, error: fetchError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id),
  })

  const { data: salaryHistory } = useQuery({
    queryKey: ['salaryHistory', id],
    queryFn: () => employeeService.getSalaryHistory(id),
    enabled: !!employee,
  })

  const updateSalaryMutation = useMutation({
    mutationFn: (salary) => employeeService.updateSalary(id, salary),
    onSuccess: () => {
      queryClient.invalidateQueries(['employee', id])
      queryClient.invalidateQueries(['salaryHistory', id])
      setOpenSalaryDialog(false)
      setNewSalary('')
      setError('')
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to update salary')
    },
  })

  const handleSalaryUpdate = () => {
    const salary = parseFloat(newSalary)
    if (isNaN(salary) || salary <= 0) {
      setError('Please enter a valid salary greater than 0')
      return
    }
    updateSalaryMutation.mutate(salary)
  }

  if (isLoading) return <Loading />
  if (fetchError) {
    return (
      <Box>
        <Typography color="error">Error loading employee details</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/employees')}
        sx={{ mb: 2 }}
      >
        Back to Employees
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5">Employee Details</Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => navigate(`/employees/${id}/edit`)}
                >
                  Edit
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1">{employee.employee_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{employee.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{employee.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Department
                  </Typography>
                  <Typography variant="body1">{employee.department}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Designation
                  </Typography>
                  <Typography variant="body1">{employee.designation}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Country
                  </Typography>
                  <Typography variant="body1">{employee.country}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Salary
                  </Typography>
                  <Typography variant="body1">
                    ${parseFloat(employee.salary).toLocaleString()} {employee.currency}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={employee.is_active ? 'Active' : 'Inactive'}
                    color={employee.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Joining Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(employee.joining_date).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={() => setOpenSalaryDialog(true)}
                >
                  Update Salary
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Salary History
              </Typography>
              {salaryHistory && salaryHistory.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Old Salary</TableCell>
                        <TableCell>New Salary</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salaryHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>
                            {new Date(history.changed_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${parseFloat(history.old_salary).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${parseFloat(history.new_salary).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No salary history available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openSalaryDialog} onClose={() => setOpenSalaryDialog(false)}>
        <DialogTitle>Update Salary</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="New Salary"
            type="number"
            fullWidth
            variant="outlined"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSalaryDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSalaryUpdate}
            variant="contained"
            disabled={updateSalaryMutation.isPending}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmployeeDetails
