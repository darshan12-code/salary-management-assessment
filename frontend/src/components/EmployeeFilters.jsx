import React from 'react'
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, useTheme, useMediaQuery } from '@mui/material'
import { Clear as ClearIcon } from '@mui/icons-material'
import { useDebounce } from '../hooks/useDebounce'

const EmployeeFilters = ({ filters, onFilterChange }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

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
    <Box 
      display="flex" 
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap={{ xs: 1, sm: 2 }} 
      alignItems={{ xs: 'stretch', sm: 'center' }}
      sx={{ mb: 0, width: '100%' }}
    >
      <TextField
        label="Search"
        value={searchInput}
        onChange={handleSearchChange}
        size={isMobile ? 'small' : 'medium'}
        sx={{ 
          minWidth: { xs: '200px', sm: 250 }, 
          maxWidth: { xs: '100%', sm: 300 },
          flexGrow: { xs: 1, sm: 0 },
          width: { xs: '100%', sm: 'auto' }
        }}
        placeholder="Name or ID..."
      />
      <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: { xs: '140px', sm: 160 }, width: { xs: '100%', sm: 'auto' } }}>
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
      <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: { xs: '140px', sm: 160 }, width: { xs: '100%', sm: 'auto' } }}>
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
          size={isMobile ? 'small' : 'medium'}
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          sx={{ height: { xs: 36, sm: 40 } }}
        >
          Clear
        </Button>
      )}
    </Box>
  )
}

export default EmployeeFilters
