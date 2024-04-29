export const StyledButtonGroupStyles = {
  '& .MuiToggleButton-root': {
    width: '100%',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 16,
    color: 'text.primary',
    borderRadius: 2,
    borderWidth: '2px',
    boxShadow: 'none',
    p: 0,
    py: 1.5,
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
        borderColor: 'text.secondary',
      },
    },
    '&.MuiToggleButton--sizeSmall': {
      padding: '6px 12px',
      fontSize: 14,
    },
  },
} as const;
