import React from 'react'
import { Card, CardContent, Box, Typography, useTheme, useMediaQuery } from '@mui/material'

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Box>
            <Typography
              color="text.secondary"
              gutterBottom
              variant={isMobile ? 'body1' : 'h6'}
              fontWeight={500}
            >
              {title}
            </Typography>
            <Typography
              variant={isMobile ? 'h5' : isTablet ? 'h4' : 'h3'}
              component="h2"
              fontWeight={600}
              color="text.primary"
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 3,
              p: { xs: 1.5, sm: 2, md: 2.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {React.cloneElement(icon, {
              sx: {
                fontSize: { xs: 32, sm: 40, md: 48 },
                color,
              },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
