import React from 'react'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import TableWrapper from './TableWrapper'
import { getTableStyles } from './tableStyles'
import { formatCurrency } from '../utils/formatUtils'

const DashboardTable = ({ title, employees, currency, isLoading, error, onRetry, isMobile: isMobileProp }) => {
  const theme = useTheme()
  const isMobile = isMobileProp !== undefined ? isMobileProp : useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const fallbackHeight = isMobile ? 200 : isTablet ? 350 : 400

  const formatSalary = (salary) => {
    const num = Number(salary)
    if (isNaN(num) || num === 0) return `${currency || 'USD'} 0`
    return formatCurrency(num, currency || 'USD')
  }

  const columns = [
    {
      field: 'employee_id',
      headerName: 'ID',
      width: isMobile ? 45 : 100,
      minWidth: isMobile ? 35 : 55,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: isMobile ? 90 : 160,
      flex: isMobile ? 1 : 1,
      minWidth: isMobile ? 70 : 100,
    },
    {
      field: 'department',
      headerName: 'Dept',
      width: isMobile ? 60 : 120,
      minWidth: isMobile ? 50 : 70,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: isMobile ? 75 : 130,
      minWidth: isMobile ? 65 : 90,
      valueFormatter: (params) => formatSalary(params),
    },
    {
      field: 'country',
      headerName: 'Country',
      width: isMobile ? 60 : 110,
      minWidth: isMobile ? 50 : 70,
    },
  ]

  if (isLoading) {
    return (
      <TableWrapper title={title} height={fallbackHeight} isLoading={isLoading} loadingMessage="Loading..." />
    )
  }

  if (error) {
    return (
      <TableWrapper title={title} height={fallbackHeight} error={error} errorMessage="Failed to load data" />
    )
  }

  if (!employees || employees.length === 0) {
    return (
      <TableWrapper title={title} height={fallbackHeight}>
        <Box sx={{ height: fallbackHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">No data available</Typography>
        </Box>
      </TableWrapper>
    )
  }

  return (
    <TableWrapper title={title} height="auto">
      <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={employees}
          columns={columns}
          disableRowSelectionOnClick
          hideFooterPagination
          autoHeight
          sx={{
            ...getTableStyles(isMobile, isTablet),
            border: 0,
            width: '100%',
            minWidth: isMobile ? '100%' : '100%',
            maxWidth: '100%',
            '& .MuiDataGrid-main': {
              minWidth: isMobile ? '100%' : '100%',
              maxWidth: '100%',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflowX: isMobile ? 'auto' : 'hidden',
            },
            '& .MuiDataGrid-cell': {
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          }}
          getRowHeight={() => (isMobile ? 40 : 48)}
        />
      </Box>
    </TableWrapper>
  )
}

export default DashboardTable