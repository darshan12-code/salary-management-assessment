import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const DashboardCharts = ({ analytics }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const chartHeight = isMobile ? 250 : isTablet ? 300 : 350

  // Prepare data for charts
  const departmentData = analytics?.employees_by_department || []
  const countryData = analytics?.employees_by_country || []
  // Payroll data is now grouped by currency - use the first currency for display or aggregate
  const currencyAnalytics = analytics?.currency_analytics || []
  const payrollData = currencyAnalytics.length > 0 
    ? currencyAnalytics[0]?.payroll_by_department || []
    : []

  // Colors for charts - Professional dashboard color palette
  const COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#F59E0B', '#DC2626', '#0891B2']

  // Format currency
  const formatCurrency = (value, currencyCode = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {/* Employees by Department */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              gutterBottom
              fontWeight="bold"
            >
              Employees by Department
            </Typography>
            <Box sx={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2563EB" name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Employees by Country */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              gutterBottom
              fontWeight="bold"
            >
              Employees by Country
            </Typography>
            <Box sx={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      isMobile
                        ? `${(percent * 100).toFixed(0)}%`
                        : `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {countryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Payroll by Department */}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              gutterBottom
              fontWeight="bold"
            >
              Payroll by Department {currencyAnalytics.length > 0 && `(${currencyAnalytics[0].currency})`}
            </Typography>
            <Box sx={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value, currencyAnalytics.length > 0 ? currencyAnalytics[0].currency : 'USD')} 
                  />
                  <Legend />
                  <Bar dataKey="total_payroll" fill="#16A34A" name="Payroll" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardCharts
