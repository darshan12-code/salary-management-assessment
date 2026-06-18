import React from 'react'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EmptyState from './EmptyState'

const SalaryHistoryTable = ({ salaryHistory, currency, isLoading, error, onRetry }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(salary)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const columns = [
    {
      field: 'old_salary',
      headerName: 'Old Salary',
      width: 150,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => formatSalary(params.value),
    },
    {
      field: 'new_salary',
      headerName: 'New Salary',
      width: 150,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => formatSalary(params.value),
    },
    // {
    //   field: 'change_amount',
    //   headerName: 'Change Amount',
    //   width: 150,
    //   flex: 1,
    //   minWidth: 120,
    //   valueFormatter: (params) => {
    //     const change = params.row.new_salary - params.row.old_salary
    //     const formatted = formatSalary(Math.abs(change))
    //     return change >= 0 ? `+${formatted}` : `-${formatted}`
    //   },
    // },
    {
      field: 'changed_at',
      headerName: 'Changed At',
      width: 200,
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => formatDate(params.value),
    },
  ]

  if (isLoading) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: 40, height: 40 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid #E2E8F0',
              borderTop: '3px solid #2563EB',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Loading salary history...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <EmptyState
        message="Failed to load salary history"
        actionLabel="Retry"
        onAction={onRetry}
      />
    )
  }

  if (!salaryHistory || salaryHistory.length === 0) {
    return (
      <EmptyState
        message="No salary history available for this employee"
      />
    )
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={salaryHistory}
        columns={columns}
        getRowId={(row) => row.id || row.changed_at}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: 600,
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
          '& .MuiDataGrid-footerContainer': {
            '& .MuiTablePagination-root': {
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
            },
          },
        }}
      />
    </Box>
  )
}

export default SalaryHistoryTable
