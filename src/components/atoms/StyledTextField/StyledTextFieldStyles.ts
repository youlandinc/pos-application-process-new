import { SxProps } from '@mui/material';

export const StyledTextFieldStyles: SxProps = {
  width: '100%',
  borderRadius: 2,
  padding: 0,
  '& .MuiInputLabel-outlined': {
    transform: 'translate(12px, 14px) scale(1)',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(12px, -8px) scale(0.75)',
  },
  '& label.Mui-focused': {
    color: 'text.focus',
  },
  '& .MuiOutlinedInput-input': {
    padding: '13.5px 14px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    boxShadow: 'none',
    input: {
      '&::placeholder': {
        color: 'text.placeholder',
      },
      color: 'text.primary',
      lineHeight: 1,
    },
    '& fieldset': {
      borderColor: 'background.border_default',
    },
    '&:hover fieldset': {
      borderColor: 'background.border_hover',
      color: 'background.border_hover',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid',
      borderColor: 'background.border_focus',
    },
  },
  '& .Mui-disabled.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'background.border_disabled',
    },
  },
  '& .Mui-disabled': {
    cursor: 'not-allowed',
  },
  '& .MuiFormHelperText-root': {
    margin: 0,
    fontSize: 12,
  },
};
