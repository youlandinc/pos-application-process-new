import { ElementType, FC } from 'react';
import {
  ClickAwayListener,
  Stack,
  SxProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';

import { StyledTooltipStyles } from './index';
import { useSwitch } from '@/hooks';

export interface StyledTooltipProps extends TooltipProps {
  theme?: 'darker' | 'main';
  sx?: SxProps;
  isDisabledClose?: boolean;
  tooltipSx?: SxProps;
  component?: ElementType;
}

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  theme = 'main',
  tooltipSx = { width: '100%' },
  component = 'div',
  ...rest
}) => {
  const { open, close, visible } = useSwitch(false);

  return (
    <ClickAwayListener onClickAway={close}>
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
          arrow: {
            sx: {
              '&:before': {
                border: '1px solid #E6E8ED',
              },
              color: 'white',
            },
          },
        }}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        onClose={close}
        open={visible}
        PopperProps={{
          disablePortal: true,
        }}
        {...rest}
      >
        <Stack
          component={component}
          onClick={() => (visible ? close() : open())}
          sx={{ width: '100%', ...tooltipSx }}
        >
          {children ? children : <span>{rest.title}</span>}
        </Stack>
      </Tooltip>
    </ClickAwayListener>
  );
};
