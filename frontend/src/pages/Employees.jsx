import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import EmployeeFilters from '../components/EmployeeFilters'
import EmployeeTable from '../components/EmployeeTable'
import TableSkeleton from '../components/TableSkeleton'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

const Employees = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Initialize state from URL params
  const [paginationModel, setPaginationModel] = useState(() => {
    const pageParam = parseInt(searchParams.get('page') || '0')
    const pageSizeParam = parseInt(searchParams.get('pageSize') || '10')
    return {
      page: pageParam,
      pageSize: pageSizeParam,
    }
  })
  
  const [filters, setFilters] = useState(() => {
    const searchParam = searchParams.get('search') || ''
    const departmentParam = searchParams.get('department') || ''
    const countryParam = searchParams.get('country') || ''
    return {
      search: searchParam,
      department: departmentParam,
      country: countryParam,
    }
  })

  // Update URL params when filters or pagination change (but not on initial mount)
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.department) params.set('department', filters.department)
    if (filters.country) params.set('country', filters.country)
    params.set('page', paginationModel.page.toString())
    params.set('pageSize', paginationModel.pageSize.toString())
    setSearchParams(params)
  }, [filters, paginationModel, setSearchParams])

  const { data: employeesData, isLoading, error, refetch } = useQuery({
    queryKey: ['employees', paginationModel.page + 1, paginationModel.pageSize, filters],
    queryFn: () =>
      employeeService.getEmployees({
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize,
        search: filters.search || undefined,
        department: filters.department || undefined,
        country: filters.country || undefined,
      }),
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPaginationModel({ ...paginationModel, page: 0 })
  }

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel)
  }

  if (isLoading) return <TableSkeleton rowCount={paginationModel.pageSize} columnCount={10} />
  if (error) {
    return (
      <ErrorState
        message="Failed to load employees. Please try again."
        onRetry={() => refetch()}
      />
    )
  }

  const employees = employeesData?.items || []
  const total = employeesData?.total || 0

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/employees/new')}
          fullWidth={{ xs: true, sm: false }}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 3 }}>
        <EmployeeFilters filters={filters} onFilterChange={handleFilterChange} />
      </Paper>

      {employees.length === 0 ? (
        <EmptyState
          message="No employees found matching your criteria"
          actionLabel="Clear Filters"
          onAction={() => setFilters({ search: '', department: '', country: '' })}
        />
      ) : (
        <EmployeeTable
          employees={employees}
          total={total}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
        />
      )}
    </Box>
  )
}

export default Employees
