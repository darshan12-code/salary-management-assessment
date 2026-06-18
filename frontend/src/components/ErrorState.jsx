import React from 'react'
import { Box, Typography, Button, Alert } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

const ErrorState = ({ message, onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={3}
    >
      <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
        <Typography variant="body1">{message}</Typography>
      </Alert>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Box>
  )
}

export default ErrorState
