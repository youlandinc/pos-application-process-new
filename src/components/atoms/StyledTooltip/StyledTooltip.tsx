import { ElementType, FC } from 'react';
import {
  ClickAwayListener,
  Stack,
  SxProps,
  Tooltip,
  TooltipProps,
} from '@mui/material';

import { useSwitch } from '@/hooks';

import { StyledTooltipStyles } from './index';

export interface StyledTooltipProps extends TooltipProps {
  theme?: 'darker' | 'main';
  sx?: SxProps;
  isDisabledClose?: boolean;
  tooltipSx?: SxProps;
  component?: ElementType;
  mode?: 'click' | 'hover' | 'for-select' | 'controlled' | 'none';
  forSelectState?: boolean;
}

export const StyledTooltip: FC<StyledTooltipProps> = ({
  sx,
  children,
  theme = 'main',
  tooltipSx = { width: '100%' },
  component = 'div',
  mode = 'click',
  forSelectState,
  ...rest
}) => {
  const { open, close, visible } = useSwitch(false);

  const renderTooltip = () => {
    switch (mode) {
      case 'click':
        return (
          <ClickAwayListener onClickAway={close}>
            <Tooltip
              arrow
              classes={{ tooltip: theme }}
              componentsProps={{
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
      case 'hover':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            componentsProps={{
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
            disableTouchListener
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'for-select':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            componentsProps={{
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
            disableHoverListener
            open={forSelectState}
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'controlled':
        return (
          <Tooltip
            arrow
            classes={{ tooltip: theme }}
            componentsProps={{
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
            onClick={visible ? close : open}
            onClose={close}
            onOpen={open}
            open={visible}
            {...rest}
          >
            {children ? children : <span>{rest.title}</span>}
          </Tooltip>
        );
      case 'none':
        return children;
      default:
        return null;
    }
  };

  return renderTooltip();
};
