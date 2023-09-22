export const StyledButtonGroupStyles = {
  '& .MuiToggleButton-root': {
    width: '100%',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: 16,
    color: 'text.primary',
    padding: '14px 20px',
    borderRadius: 2,
    boxShadow: 'none',
    py: 2,
    px: 6,
    '&.Mui-selected': {
      bgcolor: 'primary.lighter',
      borderColor: 'primary.main',
      color: 'primary.darker',
    },
    '&:disabled': {
      color: 'text.disabled',
      borderColor: 'text.secondary',
      '&.Mui-selected': {
        color: 'text.secondary',
        bgcolor: 'text.disabled',
      },
    },
    '&.MuiToggleButton--sizeSmall': {
      padding: '6px 12px',
      fontSize: 14,
    },
  },
} as const;
