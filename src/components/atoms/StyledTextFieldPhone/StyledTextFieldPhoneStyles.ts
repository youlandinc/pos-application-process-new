export const StyledTextFieldPhoneStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    boxShadow: 'none',
    input: {
      '&::placeholder': {
        color: 'text.placeholder',
      },
      color: 'info.main',
      lineHeight: 1,
      '&:focus': {
        color: 'text.primary',
      },
    },
  },
} as const;
