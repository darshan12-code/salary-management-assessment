import React from 'react'
import { Box, Skeleton } from '@mui/material'

const TableSkeleton = ({ rowCount = 10, columnCount = 10 }) => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(224, 224, 224, 1)', p: 2 }}>
        {Array.from({ length: columnCount }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            variant="text"
            width={120}
            height={32}
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
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            p: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              variant="text"
              width={100}
              height={28}
              sx={{ mr: 2, flex: 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default TableSkeleton
