import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'
import EmployeeForm from './EmployeeForm'
import SalaryInfoCard from './SalaryInfoCard'

const EmployeeProfileCard = ({ employee, onEdit, onUpdateSalary }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 2, sm: 0 }}
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600}>Employee Details</Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size={isMobile ? 'small' : 'medium'}
              onClick={onEdit}
              sx={{
                borderColor: '#E2E8F0',
                color: '#64748B',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                  color: '#2563EB',
                },
              }}
            >
              Edit
            </Button>
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Employee ID
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.employee_id}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Name
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Email
              </Typography>
              <Tooltip title={employee.email} enterDelay={300} leaveDelay={100} arrow>
                <Typography 
                  variant={isMobile ? 'body2' : 'body1'} 
                  color="text.primary"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    cursor: 'pointer'
                  }}
                >
                  {employee.email}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Department
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.department}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Designation
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.designation}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Country
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.country}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Currency
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.currency}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Joining Date
              </Typography>
              <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">
                {new Date(employee.joining_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                Status
              </Typography>
              <Chip
                label={employee.is_active ? 'Active' : 'Inactive'}
                color={employee.is_active ? 'success' : 'default'}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  fontWeight: 500,
                  backgroundColor: employee.is_active ? 'rgba(22, 163, 74, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  color: employee.is_active ? '#16A34A' : '#64748B',
                  '&:hover': {
                    backgroundColor: employee.is_active ? 'rgba(22, 163, 74, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Salary Info Card Section */}
          {onUpdateSalary && (
            <Box sx={{ mt: 3 }}>
              <SalaryInfoCard employee={employee} onUpdateSalary={onUpdateSalary} />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default EmployeeProfileCard