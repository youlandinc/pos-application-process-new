import { SxProps, TooltipProps } from '@mui/material';

export interface StyledTooltipProps extends TooltipProps {
  theme?: 'darker' | 'main';
  sx?: SxProps;
}
