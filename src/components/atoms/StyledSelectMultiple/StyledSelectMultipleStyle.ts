import { theme } from '@/theme';

export const StyledSelectMultipleStyle = {
  checkboxSx: {
    '& .MuiCheckbox-root': {
      m: 0,
    },
  },
  list: {
    width: 'auto',
    p: 0,
    mt: 0,
    '& .MuiMenuItem-root:hover': {
      bgcolor: `${theme.palette.primary.light} !important`,
    },
    '& .MuiMenuItem-root.Mui-selected': {
      bgcolor: `${theme.palette.primary.lighter} !important`,
    },
    '& .MuiMenuItem-root': {
      fontSize: 14,
      color: 'text.primary',
      bgcolor: 'transparent !important',
    },
    '& .MuiButtonBase-root': {
      '& .MuiFormControlLabel-root': {
        width: 'auto',
      },
    },
  },
  root: {
    width: '100%',
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
  helperText: {
    p: 0,
    m: 0,
    fontSize: 12,
    color: 'error.main',
  },
} as const;
