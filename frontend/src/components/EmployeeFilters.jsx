import React from 'react'
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import { Clear as ClearIcon } from '@mui/icons-material'
import { useDebounce } from '../hooks/useDebounce'

const EmployeeFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = React.useState(filters.search || '')
  const debouncedSearch = useDebounce(searchInput, 500)

  React.useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch })
  }, [debouncedSearch])

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value)
  }

  const handleDepartmentChange = (event) => {
    onFilterChange({ ...filters, department: event.target.value })
  }

  const handleCountryChange = (event) => {
    onFilterChange({ ...filters, country: event.target.value })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    onFilterChange({ search: '', department: '', country: '' })
  }

  const hasActiveFilters = filters.search || filters.department || filters.country

  return (
    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
      <TextField
        label="Search by name or employee ID"
        value={searchInput}
        onChange={handleSearchChange}
        size="small"
        sx={{ minWidth: 250, flexGrow: 1 }}
        placeholder="Enter search term..."
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Department</InputLabel>
        <Select
          value={filters.department || ''}
          onChange={handleDepartmentChange}
          label="Department"
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Operations">Operations</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Country</InputLabel>
        <Select
          value={filters.country || ''}
          onChange={handleCountryChange}
          label="Country"
        >
          <MenuItem value="">All Countries</MenuItem>
          <MenuItem value="USA">USA</MenuItem>
          <MenuItem value="India">India</MenuItem>
          <MenuItem value="UK">UK</MenuItem>
          <MenuItem value="Germany">Germany</MenuItem>
          <MenuItem value="Canada">Canada</MenuItem>
          <MenuItem value="Australia">Australia</MenuItem>
        </Select>
      </FormControl>
      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          sx={{ height: 40 }}
        >
          Clear Filters
        </Button>
      )}
    </Box>
  )
}

export default EmployeeFilters
