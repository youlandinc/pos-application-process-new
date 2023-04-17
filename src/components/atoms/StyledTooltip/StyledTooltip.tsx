import React, { FC } from 'react';
import { Box, Tooltip } from '@mui/material';

import { StyledTooltipProps, StyledTooltipStyles } from './index';

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  theme = 'main',
  ...rest
}) => {
  return (
    <Tooltip
      arrow
      classes={{ tooltip: theme }}
      componentsProps={{
        tooltip: {
          sx: Object.assign({
            ...StyledTooltipStyles,
            ...sx,
          }),
        },
      }}
      {...rest}
    >
      <Box>{children ? children : <span>{rest.title}</span>}</Box>
    </Tooltip>
  );
};
