import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Chip,
  Typography,
  Paper
} from '@mui/material'
import {
  DataGrid
} from '@mui/x-data-grid'

const EmployeeTable = ({ employees, total, paginationModel, onPaginationModelChange }) => {
  const navigate = useNavigate()

  const handleRowClick = (params) => {
    navigate(`/employees/${params.row.id}`)
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
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: params.row?.currency || 'USD',
        }).format(params.value)
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
        />
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
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  )
}

export default EmployeeTable
