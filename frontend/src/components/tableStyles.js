export const getTableStyles = (isMobile, isTablet) => ({
  width: '100%',
  '& .MuiDataGrid-root': {
    width: '100%',
  },
  '& .MuiDataGrid-cell': {
    fontSize: isMobile ? '0.75rem' : '1rem',
    borderBottom: '1px solid #E2E8F0',
  },
  '& .MuiDataGrid-columnHeader': {
    fontSize: isMobile ? '0.75rem' : '1rem',
    fontWeight: 600,
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #E2E8F0',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  '& .MuiDataGrid-row': {
    borderBottom: '1px solid #E2E8F0',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.04)',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    '& .MuiTablePagination-root': {
      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
        fontSize: isMobile ? '0.75rem' : '1rem',
      },
    },
  },
  '& .MuiDataGrid-toolbarContainer': {
    padding: '8px',
    borderBottom: '1px solid #E2E8F0',
    '& .MuiButtonBase-root': {
      fontSize: isMobile ? '0.75rem' : '1rem',
    },
  },
  '& .MuiDataGrid-menuIconButton': {
    color: '#64748B',
    padding: '4px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      color: '#2563EB',
    },
  },
  '& .MuiDataGrid-menu': {
    '& .MuiPaper-root': {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
    },
    '& .MuiMenuItem-root': {
      fontSize: isMobile ? '0.75rem' : '1rem',
      padding: '8px 12px',
      '&:hover': {
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
      },
    },
    '& .MuiCheckbox-root': {
      padding: '4px',
    },
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#F8FAFC',
  },
  '& .MuiDataGrid-virtualScroller': {
    overflowX: isMobile ? 'auto' : 'hidden',
    overflowY: 'auto',
  },
  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
    height: '8px',
    width: '8px',
  },
  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
    backgroundColor: '#CBD5E1',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#94A3B8',
    },
  },
  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
    backgroundColor: '#F1F5F9',
  },
  '& .MuiDataGrid-pinnedColumns': {
    backgroundColor: '#FFFFFF',
    boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-pinnedColumns .MuiDataGrid-columnHeader': {
    backgroundColor: '#F8FAFC',
  },
  '& .MuiDataGrid-pinnedColumns .MuiDataGrid-cell': {
    backgroundColor: '#FFFFFF',
  },
})

export const getPinnedColumnStyles = () => ({
  '& .MuiDataGrid-columnHeader[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: '#F8FAFC',
    zIndex: 100,
    boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
  },
})
