import { SxProps, TooltipProps } from '@mui/material';

export interface StyledTooltipProps extends TooltipProps {
  theme?: 'dark' | 'main';
  sx?: SxProps;
}
