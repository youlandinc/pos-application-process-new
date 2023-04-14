import { FC } from 'react';
import { Box, Tooltip } from '@mui/material';

import { StyledTooltipProps, StyledTooltipStyles } from './index';

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  ...rest
}) => {
  return (
    <Tooltip
      arrow
      // classes={{ popper: 'dr' }}
      sx={Object.assign(
        { color: 'red' },
        {
          ...StyledTooltipStyles,
          ...sx,
        },
      )}
      {...rest}
    >
      <Box>{children ? children : <span>{rest.title}</span>}</Box>
    </Tooltip>
  );
};
