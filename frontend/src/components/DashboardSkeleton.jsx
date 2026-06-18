import React from 'react'
import { Box, Card, CardContent, Skeleton, useTheme, useMediaQuery, Grid } from '@mui/material'

const StatCardSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={isMobile ? 24 : 32} />
            <Skeleton variant="text" width="40%" height={isMobile ? 36 : 48} sx={{ mt: 1 }} />
          </Box>
          <Skeleton
            variant="rectangular"
            width={isMobile ? 60 : 80}
            height={isMobile ? 60 : 80}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

const ChartSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const chartHeight = isMobile ? 250 : isTablet ? 300 : 350

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Skeleton variant="text" width="40%" height={isMobile ? 24 : 32} />
        <Skeleton variant="rectangular" width="100%" height={chartHeight} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  )
}

const TableSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const tableHeight = isMobile ? 300 : isTablet ? 350 : 400

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Skeleton variant="text" width="40%" height={isMobile ? 24 : 32} />
        <Skeleton variant="rectangular" width="100%" height={tableHeight} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  )
}

const DashboardSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 3 }} />
      
      {/* KPI Cards Skeleton */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCardSkeleton />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCardSkeleton />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCardSkeleton />
        </Grid>
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} lg={4}>
          <ChartSkeleton />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ChartSkeleton />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ChartSkeleton />
        </Grid>
      </Grid>

      {/* Tables Skeleton */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={6}>
          <TableSkeleton />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TableSkeleton />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardSkeleton
