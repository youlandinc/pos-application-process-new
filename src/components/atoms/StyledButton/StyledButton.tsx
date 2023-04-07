import { FC } from 'react';
import { Button } from '@mui/material';

import { StyledButtonClasses, StyledButtonProps } from './index';

export const StyledButton: FC<StyledButtonProps> = (props) => {
  const {
    loading = false,
    onClick,
    loadingText = 'loading',
    sx,
    variant = 'contained',
    ...rest
  } = props;
  const handledSx = () => {
    switch (variant) {
      // case 'contained':
      //   return props.color + '.A100';
      case 'text':
        return props.color + '.A200';

      case 'outlined':
        return props.color + '.A200';

      default:
        return props.color + '.A100';
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
        {},
        {
          '&.MuiButton-root': {
            '&:hover': {
              bgcolor: handledSx(),
            },
          },
          ...StyledButtonClasses,
          ...sx,
        },
      )}
      variant={variant}
      {...rest}
    >
      <>{loading ? loadingText : props.children}</>
    </Button>
  );
};
