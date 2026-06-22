import React from 'react'
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EmptyState from './EmptyState'
import TableWrapper from './TableWrapper'
import { getTableStyles } from './tableStyles'
import { formatCurrency } from '../utils/formatUtils'

const SalaryHistoryTable = ({ salaryHistory, currency, isLoading, error, onRetry }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const formatSalary = (salary) => {
    return formatCurrency(salary, currency || 'USD')
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
      valueFormatter: (params) => formatSalary(params),
    },
    {
      field: 'new_salary',
      headerName: 'New Salary',
      width: 150,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => formatSalary(params),
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
      valueFormatter: (params) => formatDate(params),
    },
  ]

  if (isLoading) {
    return (
      <TableWrapper
        title="Salary History"
        height={400}
        isLoading={isLoading}
        loadingMessage="Loading salary history..."
      />
    )
  }

  if (error) {
    return (
      <TableWrapper
        title="Salary History"
        height={400}
        error={error}
        errorMessage="Failed to load salary history"
      />
    )
  }

  if (!salaryHistory || salaryHistory.length === 0) {
    return (
      <TableWrapper
        title="Salary History"
        height={400}
      >
        <EmptyState message="No salary history available for this employee" />
      </TableWrapper>
    )
  }

  return (
    <TableWrapper title="Salary History" height={400}>
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={salaryHistory}
          columns={columns}
          getRowId={(row) => row.id || row.changed_at}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={getTableStyles(isMobile, isTablet)}
        />
      </Box>
    </TableWrapper>
  )
}

export default SalaryHistoryTable
