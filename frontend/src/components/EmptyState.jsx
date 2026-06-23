import React from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material'
import { PeopleOutline as PeopleOutlineIcon } from '@mui/icons-material'

const EmptyState = ({ message, actionLabel, onAction }) => {
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
      sx={{ textAlign: 'center' }}
    >
      <PeopleOutlineIcon 
        sx={{ 
          fontSize: isMobile ? 60 : 80, 
          color: 'text.secondary', 
          mb: 2,
          opacity: 0.5,
        }} 
      />
      <Typography 
        variant={isMobile ? "body1" : "h6"} 
        color="text.secondary" 
        gutterBottom
        sx={{ maxWidth: 500, fontWeight: 500 }}
      >
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction} 
          sx={{ mt: 2 }}
          size={isMobile ? "small" : "medium"}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState
