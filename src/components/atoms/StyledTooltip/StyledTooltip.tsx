import { FC, useState } from 'react';
import { Tooltip } from '@mui/material';

import { StyledTooltipProps, StyledTooltipStyles } from './index';

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  theme = 'darker',
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  const handledTooltipClose = () => {
    setOpen(false);
  };

  const handledTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <Tooltip
      arrow
      classes={{ tooltip: theme }}
      componentsProps={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tooltip: {
          sx: {
            ...StyledTooltipStyles,
            ...sx,
          },
        },
      }}
      onClick={handledTooltipOpen}
      onClose={handledTooltipClose}
      onMouseEnter={handledTooltipOpen}
      open={open}
      {...rest}
    >
      {children ? children : <span>{rest.title}</span>}
    </Tooltip>
  );
};
