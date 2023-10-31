import { StyledLoading } from '@/components/atoms';
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
      loadingText,
      sx,
      variant = 'contained',
      ...rest
    },
    ref,
  ) => {
    const handledSx = () => {
      switch (variant) {
        case 'text':
          return rest.color + '.darker';

        case 'outlined':
          return rest.color + '.darker';

        default:
          return rest.color + (isIconButton ? '.darker' : '.dark');
      }
    };
    return (
      <>
        {isIconButton ? (
          <IconButton
            disableRipple
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
            <>
              {loading ? (
                loadingText ? (
                  loadingText
                ) : (
                  <StyledLoading size={24} sx={{ color: 'text.grey', m: 0 }} />
                )
              ) : (
                children
              )}
            </>
          </IconButton>
        ) : (
          <Button
            disableRipple
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
            {loading ? (
              loadingText ? (
                loadingText
              ) : (
                <StyledLoading size={24} sx={{ color: 'text.grey', m: 0 }} />
              )
            ) : (
              children
            )}
          </Button>
        )}
      </>
    );
  },
);
