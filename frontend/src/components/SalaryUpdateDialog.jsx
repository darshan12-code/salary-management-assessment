import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { salaryUpdateSchema } from '../validation/employeeSchema'

const SalaryUpdateDialog = ({ open, onClose, onSubmit, currentSalary, currency, isLoading }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(salaryUpdateSchema),
    defaultValues: {
      salary: '',
    },
  })

  const formatSalary = (salary, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(salary)
  }

  const onFormSubmit = (data) => {
    onSubmit(data.salary)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>Update Salary</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Current Salary
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {formatSalary(currentSalary, currency)}
          </Typography>
        </Box>

        <Controller
          name="salary"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="New Salary"
              type="number"
              error={!!errors.salary}
              helperText={errors.salary?.message}
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <Typography sx={{ ml: 1 }}>{currency}</Typography>,
              }}
              disabled={isLoading}
              size={isMobile ? 'small' : 'medium'}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          size={isMobile ? 'small' : 'medium'}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onFormSubmit)}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          size={isMobile ? 'small' : 'medium'}
        >
          {isLoading ? 'Updating...' : 'Update Salary'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SalaryUpdateDialog
