import React from 'react'
import { Box, CircularProgress, Typography, useTheme, useMediaQuery } from '@mui/material'

const LoadingState = ({ message = 'Loading...' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
    >
      <CircularProgress size={isMobile ? 50 : 60} color="primary" />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingState
