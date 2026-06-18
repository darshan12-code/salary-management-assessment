import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  DataGrid
} from '@mui/x-data-grid'
import { Edit as EditIcon } from '@mui/icons-material'

const EmployeeTable = ({ employees, total, paginationModel, onPaginationModelChange, onEdit }) => {
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
      headerName: 'Employee ID',
      width: 120,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 220,
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 140,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: 160,
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 120,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 100,
      flex: 1,
      minWidth: 80,
    },
   {
      field: 'salary',
      headerName: 'Salary',
      width: 130,
      flex: 1,
      minWidth: 110,
      valueFormatter: (value, row) => {
        const rowData = row || value?.api?.getRow(value?.id);
        const rawValue = typeof value === 'object' ? value.value : value;
        
        const currencyCode = rowData?.currency || 'USD';

        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(rawValue);
      },
    },
    {
      field: 'joining_date',
      headerName: 'Joining Date',
      width: 140,
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString()
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      flex: 1,
      minWidth: 90,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
          sx={{
            fontWeight: 500,
            backgroundColor: params.value ? 'rgba(22, 163, 74, 0.1)' : 'rgba(100, 116, 139, 0.1)',
            color: params.value ? '#16A34A' : '#64748B',
            '&:hover': {
              backgroundColor: params.value ? 'rgba(22, 163, 74, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            },
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      flex: 0,
      minWidth: 80,
      sortable: false,
      pinnable: true,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleEditClick(event, params)}
          sx={{
            color: '#2563EB',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
            },
          }}
          title="Edit Employee"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={employees}
        columns={columns}
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 20, 50]}
        paginationMode="server"
        onRowClick={handleRowClick}
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '0.875rem' : '1rem',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: 600,
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
          '& .MuiDataGrid-pinnedColumns': {
            backgroundColor: '#FFFFFF',
            boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
          },
          '& .MuiDataGrid-pinnedColumns .MuiDataGrid-columnHeader': {
            backgroundColor: '#F8FAFC',
          },
          '& .MuiDataGrid-footerContainer': {
            '& .MuiTablePagination-root': {
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              },
            },
          },
          '& .MuiDataGrid-toolbarContainer': {
            '& .MuiButtonBase-root': {
              fontSize: isMobile ? '0.875rem' : '1rem',
            },
          },
          '& .MuiDataGrid-menuIconButton': {
            color: '#64748B',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
            },
          },
          '& .MuiDataGrid-menu': {
            '& .MuiPaper-root': {
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            },
            '& .MuiMenuItem-root': {
              fontSize: isMobile ? '0.875rem' : '1rem',
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default EmployeeTable
