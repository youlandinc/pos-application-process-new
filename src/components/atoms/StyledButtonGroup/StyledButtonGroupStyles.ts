export const StyledButtonGroupStyles = {
  '& .MuiToggleButton-root': {
    width: '100%',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: 16,
    color: 'text.primary',
    padding: '14px 20px',
    borderRadius: 2,
    borderWidth: '2px',
    boxShadow: 'none',
    py: 2,
    px: 6,
    '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
      ml: '-2px',
      borderLeft: '2px solid transparent',
    },
    '&.MuiToggleButtonGroup-grouped.Mui-selected': {
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
