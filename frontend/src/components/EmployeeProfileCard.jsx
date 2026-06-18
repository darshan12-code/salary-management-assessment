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
          <Typography variant={isMobile ? 'h6' : 'h5'}>Employee Details</Typography>
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
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Employee ID
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.employee_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Name
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Email
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Department
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.department}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Designation
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.designation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Country
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.country}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Currency
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{employee.currency}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Joining Date
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>
              {new Date(employee.joining_date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
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
