import { POSFont } from '@/styles';

export const StyledButtonStyles = {
  '&.MuiButton-root': {
    ...POSFont(16, 600, 1.5),
    textTransform: 'none',
    padding: '16px 20px',
    borderRadius: 3,
    boxShadow: 'none',
    boxSizing: 'border-box',
  },
  '&.MuiButton-contained:disabled': {
    bgcolor: '#D4D7DA',
  },
  '&.MuiButton-outlined': {
    borderWidth: '2px',
    padding: '14px 18px',
  },
  '&.MuiButton-sizeSmall': {
    padding: '6px 12px',
    fontSize: 14,
    height: 40,
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
