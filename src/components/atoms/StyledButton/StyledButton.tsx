import { Button } from '@mui/material';
import React, { FC } from 'react';
import { StyledButtonProps } from './StyledButton.types';
import { ClassesButton } from './StyledButtonClasses';

export const StyledButton: FC<StyledButtonProps> = (props) => {
  const {
    loading = false,
    onClick,
    loadingText = 'loading',
    sx,
    ...rest
  } = props;
  return (
    <Button
      sx={Object.assign({}, { ...ClassesButton, ...sx })}
      {...rest}
      onClick={(e) => {
        if (!loading && onClick) {
          onClick(e);
        } else {
          e.stopPropagation();
        }
      }}
    >
      <>{loading ? loadingText : props.children}</>
    </Button>
  );
};
