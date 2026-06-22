import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material'
import { AttachMoney as AttachMoneyIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material'
import { formatCurrency } from '../utils/formatUtils'

const SalaryInfoCard = ({ employee, onUpdateSalary }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        color: 'white',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 3 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AttachMoneyIcon sx={{ fontSize: isMobile ? 28 : 32, opacity: 0.9 }} />
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>
              Salary
            </Typography>
          </Box>
          <Chip
            label={employee.currency}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 500 }}>
            Current Salary
          </Typography>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            fontWeight={700}
            sx={{ lineHeight: 1.2 }}
          >
            {formatCurrency(employee.salary, employee.currency)}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            onClick={onUpdateSalary}
            fullWidth={isMobile}
            startIcon={<TrendingUpIcon />}
            sx={{
              bgcolor: 'white',
              color: '#2563EB',
              fontWeight: 600,
              py: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Update Salary
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SalaryInfoCard
