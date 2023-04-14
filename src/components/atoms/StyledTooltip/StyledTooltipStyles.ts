import { SxProps, tooltipClasses } from '@mui/material';
console.log(
  '🚀 ~ file: StyledTooltipStyles.ts:2 ~ tooltipClasses:',
  tooltipClasses,
);

export const StyledTooltipStyles: SxProps = {
  bgColor: 'text.primary',
  '&.MuiTooltip-arrow': {
    color: 'text.primary',
  },
};
