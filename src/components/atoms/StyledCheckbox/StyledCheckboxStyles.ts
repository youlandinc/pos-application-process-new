import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledCheckboxStyles: SxProps = {
  alignItems: 'flex-start',
  '& .MuiFormControlLabel-label': {
    width: 200,
    ml: 1.5,
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    ...POSFont(14, 400, 1.5, 'text.primary'),
  },
  '& .MuiCheckbox-root': {
    mt: '-11px',
    mr: '-11px',
    '& svg': {
      fill: '#9095A3',
    },
  },
  '& .Mui-checked': {
    '& svg': {
      fill: '#1134E3 !important',
    },
  },
  '& .Mui-disabled': {
    '& svg': {
      fill: '#CDCDCD !important',
    },
  },
};
