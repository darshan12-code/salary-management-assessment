import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { employeeService } from '../services/employeeService'
import Loading from '../components/Loading'

const Employees = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')

  const { data: employeesData, isLoading, error } = useQuery({
    queryKey: ['employees', page, pageSize, search, department],
    queryFn: () =>
      employeeService.getEmployees({
        page,
        page_size: pageSize,
        search: search || undefined,
        department: department || undefined,
      }),
  })

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value)
    setPage(1)
  }

  const handleRowClick = (id) => {
    navigate(`/employees/${id}`)
  }

  if (isLoading) return <Loading />
  if (error) {
    return (
      <Box>
        <Typography color="error">Error loading employees</Typography>
      </Box>
    )
  }

  const employees = employeesData?.items || []
  const total = employeesData?.total || 0
  const totalPages = employeesData?.total_pages || 1

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/employees/new')}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search"
            value={search}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 200, flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              onChange={handleDepartmentChange}
              label="Department"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee.id}
                hover
                onClick={() => handleRowClick(employee.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.country}</TableCell>
                <TableCell>
                  ${parseFloat(employee.salary).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={employee.is_active ? 'Active' : 'Inactive'}
                    color={employee.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  )
}

export default Employees
