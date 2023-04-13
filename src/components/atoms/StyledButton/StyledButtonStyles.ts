import { SxProps } from '@mui/material';

export const StyledButtonStyles: SxProps = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  height: '48px',
  borderRadius: 2,
  boxShadow: 'none',
  '&:disabled': {
    color: 'action.disabled',
  },
  '&.MuiButton-sizeSmall': {
    height: '36px',
    py: 1,
    fontSize: 14,
  },
  '&.MuiButton-outlinedInfo': {
    color: 'text.primary',
  },
};
