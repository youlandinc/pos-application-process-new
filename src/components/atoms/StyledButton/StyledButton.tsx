import { FC } from 'react';
import { Button } from '@mui/material';

import { StyledButtonProps, StyledButtonStyles } from './index';

export const StyledButton: FC<StyledButtonProps> = ({
  loading = false,
  onClick,
  loadingText = 'loading',
  sx,
  variant = 'contained',
  ...rest
}) => {
  const handledSx = () => {
    switch (variant) {
      // case 'contained':
      //   return props.color + '.A100';
      case 'text':
        return rest.color + '.A200';

      case 'outlined':
        return rest.color + '.A200';

      default:
        return rest.color + '.A100';
    }
  };
  return (
    <Button
      onClick={(e) => {
        if (!loading && onClick) {
          onClick(e);
        } else {
          e.stopPropagation();
        }
      }}
      sx={Object.assign(
        {
          '&.MuiButton-root': {
            '&:hover': {
              bgcolor: handledSx(),
            },
          },
        },
        {
          ...StyledButtonStyles,
          ...sx,
        },
      )}
      variant={variant}
      {...rest}
    >
      <>{loading ? loadingText : rest.children}</>
    </Button>
  );
};
