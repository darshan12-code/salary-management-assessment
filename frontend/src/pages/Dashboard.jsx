import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Typography,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
} from '@mui/material'
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Public as PublicIcon,
} from '@mui/icons-material'
import { analyticsService } from '../services/analyticsService'
import StatCard from '../components/StatCard'
import DashboardCharts from '../components/DashboardCharts'
import DashboardTable from '../components/DashboardTable'
import DashboardSkeleton from '../components/DashboardSkeleton'
import EmptyState from '../components/EmptyState'
import { formatCurrency, formatNumberWithDelimiters } from '../utils/formatUtils'

const Dashboard = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  
  const [selectedCountry, setSelectedCountry] = useState('all')

  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
  })

  const { data: topPaidEmployees, isLoading: isLoadingTopPaid } = useQuery({
    queryKey: ['topPaidEmployees', selectedCountry],
    queryFn: () => analyticsService.getTopPaidEmployees(10, selectedCountry === 'all' ? null : selectedCountry),
  })

  const { data: lowestPaidEmployees, isLoading: isLoadingLowestPaid } = useQuery({
    queryKey: ['lowestPaidEmployees', selectedCountry],
    queryFn: () => analyticsService.getLowestPaidEmployees(10, selectedCountry === 'all' ? null : selectedCountry),
  })

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value)
  }

  // Get country options
  const countryOptions = analytics?.country_analytics?.map(c => c.country) || []
  const selectedCountryData = analytics?.country_analytics?.find(c => c.country === selectedCountry)

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
    <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: { xs: 1, sm: 3 }, width: '100%' }}>
      <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '2.125rem' } }}>
        Dashboard
      </Typography>

      {/* TOP SECTION: Global KPIs */}
      <Grid container spacing={{ xs: 0.5, sm: 2, md: 3 }} sx={{ mb: { xs: 1, sm: 3 }, width: '100%' }}>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard
            title="Total Employees"
            value={analytics.total_employees || 0}
            icon={<PeopleIcon />}
            color="#3B82F6"
            isMobile={isMobile}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard
            title="Total Countries"
            value={countryOptions.length || 0}
            icon={<PublicIcon />}
            color="#8B5CF6"
            isMobile={isMobile}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <StatCard
            title="Global Payroll"
            value={formatCurrency(
              analytics.global_payroll || 0,
              'USD'
            )}
            icon={<MoneyIcon />}
            color="#10B981"
            isMobile={isMobile}
          />
        </Grid>
      </Grid>

      {/* MIDDLE SECTION: Global Charts */}
      <Box sx={{ mb: { xs: 1, sm: 3 }, width: '100%' }}>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h5'}
          gutterBottom
          fontWeight={600}
          sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' } }}
        >
          Global Analytics Overview
        </Typography>
        <Box sx={{ width: '100%' }}>
          <DashboardCharts analytics={analytics} />
        </Box>
      </Box>

      {/* BOTTOM SECTION: Country Selector and Detailed Tables */}
      <Paper sx={{ p: { xs: 1.5, sm: 3 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'visible' }}>
          <Box 
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: { xs: 1.5, sm: 2 }, width: '100%' }}>
          <Typography
            variant={isMobile ? 'subtitle1' : 'h5'}
            fontWeight={600}
            sx={{ fontSize: { xs: '0.95rem', sm: '1.25rem' }, width: { xs: '100%', sm: 'auto' } }}
          >
            Country Details
          </Typography>
          <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: { xs: '100%', sm: 200 }, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel>Select Country</InputLabel>
            <Select
              value={selectedCountry}
              label="Select Country"
              onChange={handleCountryChange}
            >
              <MenuItem value="all">All Countries</MenuItem>
              {countryOptions.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {selectedCountry === 'all' ? (
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Select a country from the dropdown above to view detailed analytics including payroll by department,
              top 10 highest paid, and top 10 lowest paid employees.
            </Typography>
            {/* Show summary of all countries */}
            <Grid container spacing={{ xs: 0.5, sm: 2, md: 3 }} sx={{ width: '100%', maxWidth: '100%' }}>
              {analytics.country_analytics && analytics.country_analytics.map((countryData) => (
                <Grid key={countryData.country} item xs={6} sm={6} lg={4}>
                  <Card sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    },
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                  }}>
                    <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#3B82F6', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                        {countryData.country}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, sm: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            Employees:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            {formatNumberWithDelimiters(countryData.total_employees)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            Currency:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            {countryData.primary_currency}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            Total Payroll:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            {formatCurrency(countryData.total_payroll, countryData.primary_currency)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            Avg Salary:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
                            {formatCurrency(countryData.average_salary, countryData.primary_currency)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : selectedCountryData ? (
          <Box sx={{ width: '100%', maxWidth: '100vw' ,py: { xs: 2, md: 3 }}} >
            <Box sx={{ width: '100%' }} >
              {/* Country-specific KPIs */}
              <Grid container  spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ width: '100%', maxWidth: '100%', mb: { xs: 1, sm: 2 } }}>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title={`Employees (${selectedCountryData.country})`}
                    value={selectedCountryData.total_employees || 0}
                    icon={<PeopleIcon />}
                    color="#3B82F6"
                    isMobile={isMobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title={`Total Payroll (${selectedCountryData.primary_currency})`}
                    value={formatCurrency(selectedCountryData.total_payroll || 0, selectedCountryData.primary_currency)}
                    icon={<MoneyIcon />}
                    color="#10B981"
                    isMobile={isMobile}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title={`Avg Salary (${selectedCountryData.primary_currency})`}
                    value={formatCurrency(selectedCountryData.average_salary || 0, selectedCountryData.primary_currency)}
                    icon={<TrendingUpIcon />}
                    color="#F59E0B"
                    isMobile={isMobile}
                  />
                </Grid>
              </Grid>

              {/* Employee Tables for selected country */}
              <Grid container spacing={{ xs: 0, sm: 2, md: 3 }} sx={{ width: '100%', maxWidth: '100%' }}>
                <Grid item xs={12} lg={6} sx={{ width: '100%', maxWidth: '100%' }}>
                  <Box sx={{ width: '100%', maxWidth: '100%', overflowX: isMobile ? 'auto' : 'visible' }}>
                    <DashboardTable
                      title={`Top 10 Highest Paid (${selectedCountryData.country})`}
                      employees={topPaidEmployees && topPaidEmployees.length > 0 ? topPaidEmployees : selectedCountryData.highest_paid_employees || []}
                      currency={selectedCountryData.primary_currency}
                      isLoading={isLoadingTopPaid}
                      isMobile={isMobile}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} sx={{ width: '100%', maxWidth: '100%' }}>
                  <Box sx={{ width: '100%', maxWidth: '100%', overflowX: isMobile ? 'auto' : 'visible' }}>
                    <DashboardTable
                      title={`Top 10 Lowest Paid (${selectedCountryData.country})`}
                      employees={lowestPaidEmployees && lowestPaidEmployees.length > 0 ? lowestPaidEmployees : selectedCountryData.lowest_paid_employees || []}
                      currency={selectedCountryData.primary_currency}
                      isLoading={isLoadingLowestPaid}
                      isMobile={isMobile}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <EmptyState message="No data available for selected country" />
        )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Dashboard
