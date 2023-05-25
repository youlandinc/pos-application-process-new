export const StyledRadioStyles = {
  '& .MuiRadio-root': {
    color: 'text.secondary',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: 'primary.A200',
    },

    '&.Mui-checked': {
      color: 'primary.main',
      '&.Mui-disabled': {
        color: 'text.disabled',
      },
    },
    '&.Mui-disabled': {
      color: 'text.disabled',
      borderColor: 'text.secondary',
    },
    '&.MuiToggleButton--sizeSmall': {
      height: '36px',
      py: 1,
      fontSize: 14,
    },
  },
} as const;
