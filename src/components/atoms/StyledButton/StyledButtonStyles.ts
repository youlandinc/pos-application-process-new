import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledButtonStyles: SxProps = {
  ...POSFont(16, 600, 1.5),
  textTransform: 'none',
  padding: '15px 20px',
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
    padding: '7px 12px',
    fontSize: 14,
  },
  '&.MuiButton-outlinedInfo, &.MuiButton-textInfo': {
    color: 'text.primary',
  },
} as const;
