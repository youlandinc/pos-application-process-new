import { SxProps, tooltipClasses } from '@mui/material';
console.log(
  '🚀 ~ file: StyledTooltipStyles.ts:2 ~ tooltipClasses:',
  tooltipClasses,
);

export const StyledTooltipStyles: SxProps = {
  fontSize: 12,
  fontWeight: 400,
  '&.dark': {
    bgcolor: 'text.primary',
    '& .MuiTooltip-arrow': {
      color: 'text.primary',
    },
  },
};
