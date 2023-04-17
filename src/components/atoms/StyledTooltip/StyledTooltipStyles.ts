import { SxProps } from '@mui/material';

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
