import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material'

const SalaryCard = ({ employee, onUpdateSalary }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const formatSalary = (salary, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(salary)
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        color: 'white',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>Current Salary</Typography>
          <AttachMoneyIcon sx={{ fontSize: isMobile ? 32 : 48, opacity: 0.9 }} />
        </Box>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          fontWeight={700}
          gutterBottom
        >
          {formatSalary(employee.salary, employee.currency)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, fontWeight: 500 }}>
          {employee.currency}
        </Typography>
        <Button
          variant="contained"
          onClick={onUpdateSalary}
          fullWidth={isMobile}
          sx={{
            bgcolor: 'white',
            color: '#2563EB',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          Update Salary
        </Button>
      </CardContent>
    </Card>
  )
}

export default SalaryCard
