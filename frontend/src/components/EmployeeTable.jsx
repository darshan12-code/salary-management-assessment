import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  DataGrid
} from '@mui/x-data-grid'
import { Edit as EditIcon } from '@mui/icons-material'
import { formatCurrency } from '../utils/formatUtils'
import { getTableStyles, getPinnedColumnStyles } from './tableStyles'

const EmployeeTable = memo(({ employees, total, paginationModel, onPaginationModelChange, onEdit }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const handleRowClick = (params) => {
    navigate(`/employees/${params.row.id}`)
  }

  const handleEditClick = (event, params) => {
    event.stopPropagation()
    onEdit(params.row)
  }

  const columns = [
    {
      field: 'employee_id',
      headerName: 'ID',
      width: isMobile ? 60 : 120,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 50 : 120,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: isMobile ? 120 : 180,
      flex: isMobile ? 1 : 1,
      minWidth: isMobile ? 100 : 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: isMobile ? 150 : 220,
      flex: isMobile ? 1 : 1,
      minWidth: isMobile ? 130 : 180,
    },
    {
      field: 'department',
      headerName: 'Dept',
      width: isMobile ? 100 : 140,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 80 : 120,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: isMobile ? 120 : 160,
      flex: isMobile ? 1 : 1,
      minWidth: isMobile ? 100 : 140,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: isMobile ? 80 : 120,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 70 : 100,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: isMobile ? 70 : 100,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 60 : 80,
    },
   {
      field: 'salary',
      headerName: 'Salary',
      width: isMobile ? 100 : 130,
      flex: isMobile ? 1 : 1,
      minWidth: isMobile ? 85 : 110,
      valueFormatter: (value, row) => {
        const rowData = row || value?.api?.getRow(value?.id);
        const rawValue = typeof value === 'object' ? value.value : value;
        const currencyCode = rowData?.currency || 'USD';
        return formatCurrency(rawValue, currencyCode);
      },
    },
    {
      field: 'joining_date',
      headerName: 'Join Date',
      width: isMobile ? 100 : 140,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 85 : 120,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString()
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: isMobile ? 70 : 100,
      flex: isMobile ? 0 : 1,
      minWidth: isMobile ? 60 : 90,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
          sx={{
            fontWeight: 600,
            fontSize: isMobile ? '0.7rem' : '0.75rem',
            backgroundColor: params.value ? '#DCFCE7' : '#F1F5F9',
            color: params.value ? '#166534' : '#64748B',
            border: params.value ? '1px solid #86EFAC' : '1px solid #E2E8F0',
            '&:hover': {
              backgroundColor: params.value ? '#BBF7D0' : '#E2E8F0',
            },
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 60 : 80,
      flex: 0,
      minWidth: isMobile ? 50 : 80,
      sortable: false,
      pinnable: true,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleEditClick(event, params)}
          sx={{
            color: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            padding: isMobile ? '4px' : '8px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              color: '#1D4ED8',
            },
          }}
          title="Edit Employee"
        >
          <EditIcon fontSize={isMobile ? 'inherit' : 'small'} />
        </IconButton>
      ),
    },
  ]

  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '100%',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 3, md: 4 }, height: '100%', overflow: 'visible' }}>
        <Box sx={{ width: '100%', maxWidth: '100%', overflowX: isMobile ? 'auto' : 'visible' }}>
          <DataGrid
            rows={employees}
            columns={columns}
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            paginationMode="server"
            onRowClick={handleRowClick}
            pinnedColumns={{ right: ['actions'] }}
            sx={{
              ...getTableStyles(isMobile, isTablet),
              ...getPinnedColumnStyles(),
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
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </CardContent>
    </Card>
  )
})

export default EmployeeTable
