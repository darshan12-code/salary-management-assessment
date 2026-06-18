import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Edit as EditIcon } from '@mui/icons-material'

const EmployeeProfileCard = ({ employee, onEdit }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Card>
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
            fullWidth={isMobile}
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
            <Typography variant={isMobile ? 'body2' : 'body1'} color="text.primary">{employee.email}</Typography>
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
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EmployeeProfileCard
