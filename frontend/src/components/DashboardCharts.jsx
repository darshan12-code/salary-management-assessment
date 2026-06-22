import React, { useMemo } from 'react'
import {
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { formatLargeNumber, formatCurrency } from '../utils/formatUtils'
import { BarChartCard, PieChartCard } from './charts'

const DEFAULT_CHART_CONFIG = {
  showEmployeesByDepartment: true,
  showEmployeesByCountry: true,
  showPayrollByDepartment: true,
  colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'],
}

const DashboardCharts = ({ analytics, config = DEFAULT_CHART_CONFIG }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const chartHeight = isMobile ? 200 : isTablet ? 300 : 350

  const chartData = useMemo(() => {
    const departmentData = analytics?.employees_by_department || []
    const countryData = analytics?.employees_by_country || []
    const countryAnalytics = analytics?.country_analytics || []
    
    const payrollData = analytics?.average_salary_by_department?.map(item => ({
      department: item.department,
      total_payroll: item.total_payroll,
      count: item.count,
      average_salary: item.average_salary
    })) || []

    return { departmentData, countryData, payrollData, countryAnalytics }
  }, [analytics])

  const getTooltipFormatter = (dataKey) => {
    if (dataKey === 'count') {
      return (value) => formatLargeNumber(value)
    } else if (dataKey === 'total_payroll') {
      return (value) => formatCurrency(value, 'USD')
    }
    return undefined
  }

  return (
    <Grid container spacing={{ xs: 1, sm: 3 }} sx={{ width: '100%', m: 0 }}>
      {config.showEmployeesByDepartment && (
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%', height: '100%', minWidth: 0 }}>
            <BarChartCard
              title="Employees by Department"
              data={chartData.departmentData}
              dataKey="count"
              xAxisKey="department"
              color="#3B82F6"
              name="Employees"
              height={chartHeight}
              isMobile={isMobile}
              tooltipFormatter={getTooltipFormatter('count')}
            />
          </Box>
        </Grid>
      )}

      {config.showEmployeesByCountry && (
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%', height: '100%', minWidth: 0 }}>
            <PieChartCard
              title="Employees by Country"
              data={chartData.countryData}
              dataKey="count"
              colors={config.colors}
              height={chartHeight}
              isMobile={isMobile}
              showLabels={true}
              totalData={chartData.countryData}
              nameKey="country"
              additionalFields={[
                {
                  key: 'average_salary',
                  label: 'Avg Salary',
                  formatter: (value) => formatCurrency(value, 'USD')
                }
              ]}
            />
          </Box>
        </Grid>
      )}

      {config.showPayrollByDepartment && (
        <Grid item xs={12} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%', height: '100%', minWidth: 0 }}>
            <BarChartCard
              title="Payroll by Department (Global)"
              data={chartData.payrollData}
              dataKey="total_payroll"
              xAxisKey="department"
              color="#10B981"
              name="Payroll"
              height={chartHeight}
              isMobile={isMobile}
              tooltipFormatter={getTooltipFormatter('total_payroll')}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default DashboardCharts
