import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Typography,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/StatCard'
import DashboardCharts from '../components/DashboardCharts'
import DashboardTable from '../components/DashboardTable'
import DashboardSkeleton from '../components/DashboardSkeleton'
import EmptyState from '../components/EmptyState'

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
  })

  const formatCurrency = (value, currencyCode = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          Error loading analytics data: {error.message}
        </Alert>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
          Dashboard
        </Typography>
        <EmptyState message="No analytics data available" />
      </Box>
    )
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Total Employees"
            value={analytics.total_employees || 0}
            icon={<PeopleIcon />}
            color="#2563EB"
          />
        </Grid>
        {/* Currency-specific payroll cards */}
        {analytics.currency_analytics && analytics.currency_analytics.map((currencyData) => (
          <Grid key={currencyData.currency} item xs={12} sm={6} lg={4}>
            <StatCard
              title={`Total Payroll (${currencyData.currency})`}
              value={formatCurrency(currencyData.total_payroll || 0, currencyData.currency)}
              icon={<MoneyIcon />}
              color="#16A34A"
            />
          </Grid>
        ))}
        {/* Currency-specific average salary cards */}
        {analytics.currency_analytics && analytics.currency_analytics.map((currencyData) => (
          <Grid key={`avg-${currencyData.currency}`} item xs={12} sm={6} lg={4}>
            <StatCard
              title={`Average Salary (${currencyData.currency})`}
              value={formatCurrency(currencyData.average_salary || 0, currencyData.currency)}
              icon={<TrendingUpIcon />}
              color="#F59E0B"
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          fontWeight={600}
        >
          Analytics Overview
        </Typography>
        <DashboardCharts analytics={analytics} />
      </Box>

      {/* Employee Tables - Grouped by Currency */}
      {analytics.currency_analytics && analytics.currency_analytics.map((currencyData) => (
        <Box key={`tables-${currencyData.currency}`} sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            gutterBottom
            fontWeight={600}
          >
            {currencyData.currency} Analytics
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} lg={6}>
              <DashboardTable
                title={`Top 10 Highest Paid (${currencyData.currency})`}
                employees={currencyData.highest_paid_employees || []}
                currency={currencyData.currency}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <DashboardTable
                title={`Top 10 Lowest Paid (${currencyData.currency})`}
                employees={currencyData.lowest_paid_employees || []}
                currency={currencyData.currency}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  )
}

export default Dashboard
