import React from 'react'
import { Box, Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material'

const TableWrapper = ({ children, title, height, isLoading, error, emptyMessage, loadingMessage, errorMessage }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
        {title && (
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Typography variant={isMobile ? 'subtitle2' : 'h5'} fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '0.85rem', sm: '1.25rem' } }}>
              {title}
            </Typography>
          </Box>
        )}
        {isLoading ? (
          <Box
            sx={{
              height: height || 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ width: 40, height: 40 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '3px solid #E2E8F0',
                  borderTop: '3px solid #2563EB',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {loadingMessage || 'Loading...'}
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              height: height || 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="error" fontWeight={500}>
              {errorMessage || 'Failed to load data'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'visible', width: '100%', maxWidth: '100%' }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default TableWrapper
