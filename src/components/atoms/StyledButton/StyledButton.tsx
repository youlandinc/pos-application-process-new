import { forwardRef } from 'react';
import { Button, IconButton } from '@mui/material';

import { StyledButtonProps, StyledButtonStyles } from './index';

export const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  (
    {
      children,
      loading,
      isIconButton = false,
      onClick,
      loadingText = 'Loading...',
      sx,
      variant = 'contained',
      ...rest
    },
    ref,
  ) => {
    const handledSx = () => {
      switch (variant) {
        // case 'contained':
        //   return props.color + '.A100';
        case 'text':
          return rest.color + '.A200';

        case 'outlined':
          return rest.color + '.A200';

        default:
          return rest.color + (isIconButton ? '.A200' : '.A100');
      }
    };
    return (
      <>
        {isIconButton ? (
          <IconButton
            onClick={(e) => {
              if (!loading && onClick) {
                onClick(e);
              } else {
                e.stopPropagation();
              }
            }}
            ref={ref}
            sx={{
              '&.MuiButton-root, &.MuiIconButton-root ': {
                '&:hover': {
                  bgcolor: handledSx(),
                },
              },
              ...StyledButtonStyles,
              ...sx,
            }}
            {...rest}
          >
            <>{loading ? loadingText : children}</>
          </IconButton>
        ) : (
          <Button
            onClick={(e) => {
              if (!loading && onClick) {
                onClick(e);
              } else {
                e.stopPropagation();
              }
            }}
            ref={ref}
            sx={{
              '&:hover': {
                bgcolor: handledSx(),
              },
              ...StyledButtonStyles,
              ...sx,
            }}
            variant={variant}
            {...rest}
          >
            <>{loading ? loadingText : children}</>
          </Button>
        )}
      </>
    );
  },
);
