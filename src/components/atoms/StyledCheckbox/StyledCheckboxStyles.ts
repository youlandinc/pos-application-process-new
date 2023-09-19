import { POSFont } from '@/styles';
import { theme } from '@/theme';

export const StyledCheckboxStyles = {
  alignItems: 'flex-start',
  // width: '100%',
  '& .MuiFormControlLabel-label': {
    width: '100%',
    ml: 1.5,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    ...POSFont(14, 400, 1.5, 'text.primary'),
  },
  '& .Mui-checked': {
    '& svg > path': {
      fill: `${theme.palette.primary.main} !important`,
    },
  },
  '& .MuiCheckbox-root': {
    mt: '-11px',
    mr: '-11px',
    '& svg > path': {
      fill: '#929292',
    },
  },
  '& .Mui-disabled': {
    '& svg > path': {
      fill: `${theme.palette.action.disabled} !important`,
    },
  },
} as const;
