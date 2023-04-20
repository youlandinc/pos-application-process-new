import { StyledSelectStyles } from '@/components/atoms';

export const StyledSelectMultipleStyle = {
  ...StyledSelectStyles,
  checkboxSx: {
    '& .MuiCheckbox-root': {
      m: 0,
      '& svg': {
        fill: '#9095A3',
      },
    },
  },
} as const;
