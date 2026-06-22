import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { employeeSchema, COUNTRY_CURRENCY_MAP, DEPARTMENTS, COUNTRIES } from '../validation/employeeSchema'

const EmployeeForm = ({ mode = 'create', initialData, onSubmit, onCancel, isLoading, error, success }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      employee_id: '',
      name: '',
      email: '',
      department: '',
      designation: '',
      country: '',
      salary: 0,
      currency: '',
      joining_date: '',
      is_active: true,
    },
  })

  const watchedCountry = watch('country')

  // Auto-update currency when country changes
  useEffect(() => {
    if (watchedCountry && COUNTRY_CURRENCY_MAP[watchedCountry]) {
      setValue('currency', COUNTRY_CURRENCY_MAP[watchedCountry])
    }
  }, [watchedCountry, setValue])

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const onFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        component="h1"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 }, flexShrink: 0 }}
        fontWeight={600}
      >
        {mode === 'create' ? 'Create New Employee' : 'Edit Employee'}
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3, flexShrink: 0 }}>
          {mode === 'create' ? 'Employee created successfully!' : 'Employee updated successfully!'}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, flexShrink: 0 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Employee ID */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Employee ID"
                    error={!!errors.employee_id}
                    helperText={errors.employee_id?.message}
                    disabled={mode === 'edit'}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.department} size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Department</InputLabel>
                    <Select {...field} label="Department">
                      {DEPARTMENTS.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.department && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.department.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Designation */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Designation"
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.country} size={isMobile ? 'small' : 'medium'}>
                    <InputLabel>Country</InputLabel>
                    <Select {...field} label="Country">
                      {COUNTRIES.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.country && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.country.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Currency"
                    disabled
                    size={isMobile ? 'small' : 'medium'}
                    helperText="Auto-updated based on country"
                  />
                )}
              />
            </Grid>

            {/* Salary */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary"
                control={control}
                rules={{ valueAsNumber: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Salary"
                    type="number"
                    error={!!errors.salary}
                    helperText={errors.salary?.message}
                    InputProps={{
                      inputProps: { min: 0, step: 0.01 },
                    }}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Joining Date */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="joining_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Joining Date"
                    type="date"
                    error={!!errors.joining_date}
                    helperText={errors.joining_date?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size={isMobile ? 'small' : 'medium'}
                  />
                )}
              />
            </Grid>

            {/* Is Active */}
            <Grid item xs={12}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Active Employee"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Sticky Button Section */}
        <Box
          sx={{
            flexShrink: 0,
            pt: 3,
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
              fullWidth={isMobile}
              sx={{
                minWidth: { sm: 120 },
                borderColor: '#E2E8F0',
                color: '#64748B',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                },
                '&:disabled': {
                  borderColor: '#F1F5F9',
                  color: '#CBD5E1',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset()}
              disabled={isLoading || !isDirty}
              fullWidth={isMobile}
              sx={{
                minWidth: { sm: 120 },
                borderColor: '#E2E8F0',
                color: '#64748B',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                },
                '&:disabled': {
                  borderColor: '#F1F5F9',
                  color: '#CBD5E1',
                },
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{
                minWidth: { sm: 150 },
                backgroundColor: '#2563EB',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                },
                '&:disabled': {
                  backgroundColor: '#93C5FD',
                },
              }}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Update Employee'}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default EmployeeForm
