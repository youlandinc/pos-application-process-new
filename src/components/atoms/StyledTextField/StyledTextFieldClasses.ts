import { SxProps } from '@mui/material';

export const StyledTextFieldClasses: SxProps = {
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
    color: 'action.focus',
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
      borderColor: 'action.default',
    },
    '&:hover fieldset': {
      borderColor: 'action.hover',
      color: 'action.hover',
    },
    '&.Mui-focused fieldset': {
      border: '1px solid',
      borderColor: 'action.focus',
    },
  },
  '& .Mui-disabled.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'action.disabled',
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
