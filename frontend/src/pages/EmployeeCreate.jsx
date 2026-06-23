import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import EmployeeForm from '../components/EmployeeForm'

const EmployeeCreate = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const createMutation = useMutation({
    mutationFn: (data) => employeeService.createEmployee(data),
    onSuccess: () => {
      setSuccess(true)
      setError(null)
      setTimeout(() => {
        navigate('/employees')
      }, 1500)
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to create employee. Please try again.')
      setSuccess(false)
    },
  })

  const handleSubmit = (data) => {
    setSuccess(false)
    setError(null)
    createMutation.mutate(data)
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
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" fontWeight={600}>
          Add New Employee
        </Typography>
      </Box>

      <EmployeeForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        error={error}
        success={success}
      />
    </Box>
  )
}

export default EmployeeCreate
