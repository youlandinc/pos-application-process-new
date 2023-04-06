import { FC } from 'react';
import { Button } from '@mui/material';

import { StyledButtonClasses, StyledButtonProps } from './index';

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
      onClick={(e) => {
        if (!loading && onClick) {
          onClick(e);
        } else {
          e.stopPropagation();
        }
      }}
      sx={Object.assign({}, { ...StyledButtonClasses, ...sx })}
      {...rest}
    >
      <>{loading ? loadingText : props.children}</>
    </Button>
  );
};
