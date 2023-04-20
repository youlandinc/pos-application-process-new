import { SxProps } from '@mui/material';

export const StyledButtonStyles: SxProps = {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  padding: '14px 20px',
  borderRadius: 2,
  boxShadow: 'none',
  '&:disabled': {
    color: 'info.main',
  },
  '&.MuiButton-contained:disabled': {
    bgcolor: '#D4D7DA',
  },
  '&.Mui-disabled': {
    borderColor: 'background.broder_disabled',
  },
  '&.MuiButton-sizeSmall': {
    padding: '6px 12px',
    fontSize: 14,
  },
  '&.MuiButton-outlinedInfo': {
    color: 'text.primary',
  },
} as const;
