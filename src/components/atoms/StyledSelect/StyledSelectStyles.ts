export const StyledSelectStyles = {
  root: {
    width: '100%',
    maxWidth: 600,
    '& .Mui-disabled': {
      color: 'text.disabled',
      cursor: 'not-allowed',
    },
    '& .MuiInputBase-formControl': {
      borderRadius: 2,
    },
    '& .MuiInputLabel-formControl.Mui-focused': {
      color: 'text.primary',
    },
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #202939 !important',
      },
      '& .MuiOutlinedInput-input': {
        background: 'transparent',
      },
    },
  },
  list: {
    '& .Mui-selected': {
      bgcolor: '#C5D1FF !important',
    },
    '& .MuiMenuItem-root': {
      fontSize: 14,
      color: 'text.primary',
    },
  },
  helperText: {
    p: 0,
    m: 0,
    fontSize: 12,
    color: 'error.main',
  },
} as const;
