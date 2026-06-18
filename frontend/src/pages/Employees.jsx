import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import EmployeeFilters from '../components/EmployeeFilters'
import EmployeeTable from '../components/EmployeeTable'
import TableSkeleton from '../components/TableSkeleton'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import EmployeeForm from '../components/EmployeeForm'

const Employees = () => {
  const queryClient = useQueryClient()
  
  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Local state for filters and pagination (no URL synchronization)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    country: '',
  })

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: (data) => employeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setFormSuccess(true)
      setFormError(null)
      setTimeout(() => {
        setCreateDialogOpen(false)
        setFormSuccess(false)
      }, 1500)
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || 'Failed to create employee. Please try again.')
      setFormSuccess(false)
    },
  })

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setFormSuccess(true)
      setFormError(null)
      setTimeout(() => {
        setEditDialogOpen(false)
        setEditingEmployee(null)
        setFormSuccess(false)
      }, 1500)
    },
    onError: (err) => {
      setFormError(err.response?.data?.detail || 'Failed to update employee. Please try again.')
      setFormSuccess(false)
    },
  })

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

  const handleCreateDialogOpen = () => {
    setFormSuccess(false)
    setFormError(null)
    setCreateDialogOpen(true)
  }

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false)
    setFormSuccess(false)
    setFormError(null)
  }

  const handleEditDialogOpen = (employee) => {
    setEditingEmployee(employee)
    setFormSuccess(false)
    setFormError(null)
    setEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setEditingEmployee(null)
    setFormSuccess(false)
    setFormError(null)
  }

  const handleCreateSubmit = (data) => {
    createMutation.mutate(data)
  }

  const handleEditSubmit = (data) => {
    updateMutation.mutate({ id: editingEmployee.id, data })
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
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 2, sm: 3 }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 2, sm: 0 }}
      >
        <Typography variant="h4" component="h1" fontWeight={600}>
          Employees
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCreateDialogOpen} 
          size="small" 
          sx={{
            width: { xs: 'auto', sm: 'auto' }, 
            minWidth: '150px',                 
            height: '36px'                    
          }}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
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
          onEdit={handleEditDialogOpen}
        />
      )}

      {/* Create Employee Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' },
        }}
      >
        <DialogTitle fontWeight={600}>Create New Employee</DialogTitle>
        <DialogContent dividers>
          <EmployeeForm
            mode="create"
            onSubmit={handleCreateSubmit}
            isLoading={createMutation.isPending}
            error={formError}
            success={formSuccess}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' },
        }}
      >
        <DialogTitle fontWeight={600}>Edit Employee</DialogTitle>
        <DialogContent dividers>
          {editingEmployee && (
            <EmployeeForm
              mode="edit"
              initialData={{
                employee_id: editingEmployee.employee_id,
                name: editingEmployee.name,
                email: editingEmployee.email,
                department: editingEmployee.department,
                designation: editingEmployee.designation,
                country: editingEmployee.country,
                salary: editingEmployee.salary,
                currency: editingEmployee.currency,
                joining_date: editingEmployee.joining_date?.split('T')[0] || '',
                is_active: editingEmployee.is_active,
              }}
              onSubmit={handleEditSubmit}
              isLoading={updateMutation.isPending}
              error={formError}
              success={formSuccess}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} disabled={updateMutation.isPending}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Employees
