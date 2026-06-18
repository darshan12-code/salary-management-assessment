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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
      <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Total Employees"
            value={analytics.total_employees || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Total Payroll"
            value={formatCurrency(analytics.total_payroll || 0)}
            icon={<MoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            title="Average Salary"
            value={formatCurrency(analytics.average_salary || 0)}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          fontWeight="bold"
        >
          Analytics Overview
        </Typography>
        <DashboardCharts analytics={analytics} />
      </Box>

      {/* Employee Tables */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={6}>
          <DashboardTable
            title="Top 10 Highest Paid Employees"
            employees={analytics.highest_paid_employees || []}
            currency={analytics.currency || 'USD'}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DashboardTable
            title="Top 10 Lowest Paid Employees"
            employees={analytics.lowest_paid_employees || []}
            currency={analytics.currency || 'USD'}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
