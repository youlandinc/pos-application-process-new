import { StyledSelectStyles } from '@/components/atoms';
import { SxProps } from '@mui/material';

export const StyledSelectMultipleStyle: Record<string, SxProps> = {
  ...StyledSelectStyles,
  checkboxSx: {
    '& .MuiCheckbox-root': {
      m: 0,
      '& svg': {
        fill: '#9095A3',
      },
    },
  },
};
