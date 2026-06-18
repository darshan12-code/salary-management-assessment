import React from 'react'
import { Box, Skeleton, useTheme, useMediaQuery } from '@mui/material'

const TableSkeleton = ({ rowCount = 10, columnCount = 10 }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #E2E8F0', p: { xs: 1.5, sm: 2 }, backgroundColor: '#F8FAFC' }}>
        {Array.from({ length: columnCount }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="text"
            width={120}
            height={isMobile ? 28 : 32}
            sx={{ mr: 2, flex: 1 }}
          />
        ))}
      </Box>
      
      {/* Row Skeletons */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <Box
          key={`row-${rowIndex}`}
          sx={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            p: { xs: 1.5, sm: 2 },
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
            },
          }}
        >
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={100}
              height={isMobile ? 24 : 28}
              sx={{ mr: 2, flex: 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default TableSkeleton
