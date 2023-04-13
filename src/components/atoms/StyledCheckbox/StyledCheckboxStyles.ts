import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledCheckboxStyles: Record<string, SxProps> = {
  label: {
    alignItems: 'flex-start',
    '& .MuiFormControlLabel-label': {
      width: 200,
      ml: 1.5,
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      ...POSFont(14, 400, 1.5, 'text.primary'),
    },
  },
  checkbox: {
    '& .MuiCheckbox-root': {
      mt: '-10px',
      mr: '-10px',
      '& svg': {
        fill: '#9095A3',
      },
    },
    '& .Mui-checked': {
      '& svg': {
        fill: '#1134E3',
      },
    },
    '& .Mui-disabled': {
      '& svg': {
        fill: '#CDCDCD',
      },
    },
  },
};
