import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledButtonStyles: SxProps = {
  '&.MuiButton-root': {
    ...POSFont(16, 600, 1.5),
    textTransform: 'none',
    padding: '15px 20px',
    borderRadius: 2,
    boxShadow: 'none',
  },
  '&.MuiButton-contained:disabled': {
    bgcolor: '#D4D7DA',
  },

  '&.MuiButton-sizeSmall': {
    padding: '7px 12px',
    fontSize: 14,
  },
  '&.MuiButton-outlinedInfo, &.MuiButton-textInfo , &.MuiIconButton-colorInfo':
    {
      color: 'text.primary',
    },
  '&.MuiIconButton-root,&.MuiButton-root': {
    '&:disabled': {
      color: 'info.main',
    },
    '&.Mui-disabled': {
      pointerEvents: 'auto',
      cursor: 'not-allowed',
      borderColor: 'background.broder_disabled',
    },
  },
} as const;
