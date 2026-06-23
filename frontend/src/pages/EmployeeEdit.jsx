import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import EmployeeForm from '../components/EmployeeForm'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'

const EmployeeEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const { data: employee, isLoading, error: fetchError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (data) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      setSuccess(true)
      setError(null)
      setTimeout(() => {
        navigate(`/employees/${id}`)
      }, 1500)
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to update employee. Please try again.')
      setSuccess(false)
    },
  })

  const handleSubmit = (data) => {
    setSuccess(false)
    setError(null)
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return <LoadingState message="Loading employee data..." />
  }

  if (fetchError) {
    return (
      <ErrorState
        message="Failed to load employee data. Please try again."
        onRetry={() => window.location.reload()}
      />
    )
  }

  const initialData = employee ? {
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
  } : null

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
          onClick={() => navigate(`/employees/${id}`)}
          sx={{ mr: { sm: 2 }, alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Back to Employee Details
        </Button>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" fontWeight={600}>
          Edit Employee
        </Typography>
      </Box>

      <EmployeeForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        error={error}
        success={success}
      />
    </Box>
  )
}

export default EmployeeEdit
