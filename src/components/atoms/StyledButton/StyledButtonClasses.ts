import { SxProps } from '@mui/material';

export const StyledButtonClasses: SxProps = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  height: '48px',
  borderRadius: 2,
  '&:disabled': {
    color: 'action.disabled',
  },
};
