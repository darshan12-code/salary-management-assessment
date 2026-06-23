import React from 'react'
import { Box, Typography, Button, Alert, useTheme, useMediaQuery } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

const ErrorState = ({ message, onRetry }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={3}
    >
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2, 
          maxWidth: 500,
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: '#DC2626',
          '& .MuiAlert-icon': {
            color: '#DC2626',
          },
        }}
      >
        <Typography variant="body1" fontWeight={500}>{message}</Typography>
      </Alert>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            backgroundColor: '#DC2626',
            '&:hover': {
              backgroundColor: '#B91C1C',
            },
          }}
        >
          Retry
        </Button>
      )}
    </Box>
  )
}

export default ErrorState
