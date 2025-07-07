import { StyledLoading } from '@/components/atoms';
import { forwardRef } from 'react';
import { Button, IconButton } from '@mui/material';

import { StyledButtonProps, StyledButtonStyles } from './index';
import { useBreakpoints } from '@/hooks';

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
      loadingSize = 24,
      ...rest
    },
    ref,
  ) => {
    const breakpoints = useBreakpoints();

    const handledSx = () => {
      switch (variant) {
        case 'text':
          return rest.color + '.darker';
        case 'outlined':
          if (rest.color === 'primary') {
            return rest.color + '.lightest';
          }
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
                  <StyledLoading
                    size={loadingSize}
                    sx={{ color: 'text.grey', m: 0 }}
                  />
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
            size={
              rest.size
                ? rest.size
                : ['xs', 'sm', 'md'].includes(breakpoints)
                  ? 'small'
                  : 'medium'
            }
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
                <StyledLoading
                  size={loadingSize}
                  sx={{ color: 'text.grey', m: 0 }}
                />
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
