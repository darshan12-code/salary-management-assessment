import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const DashboardTable = ({ title, employees, currency, isLoading, error, onRetry }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const tableHeight = isMobile ? 300 : isTablet ? 350 : 400

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(salary)
  }

  const columns = [
    {
      field: 'employee_id',
      headerName: 'Employee ID',
      width: 120,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 140,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 140,
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => formatSalary(params.value),
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 120,
      flex: 1,
      minWidth: 80,
    },
  ]

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            gutterBottom
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Box
            sx={{
              height: tableHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Loading...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            gutterBottom
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Box
            sx={{
              height: tableHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="error">
              Failed to load data
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            gutterBottom
            fontWeight="bold"
          >
            {title}
          </Typography>
          <Box
            sx={{
              height: tableHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          gutterBottom
          fontWeight="bold"
        >
          {title}
        </Typography>
        <Box sx={{ height: tableHeight }}>
          <DataGrid
            rows={employees}
            columns={columns}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            hideFooterPagination
            sx={{
              '& .MuiDataGrid-cell': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
              '& .MuiDataGrid-columnHeader': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default DashboardTable
