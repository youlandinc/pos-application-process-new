import { FC } from 'react';
import { TextField } from '@mui/material';

import { StyledTextFieldClasses, StyledTextFieldTypes } from './index';

export const StyledTextField: FC<StyledTextFieldTypes> = ({
  sx,
  value = '',
  onChange,
  variant = 'outlined',
  ...rest
}) => {
  return (
    <>
      <TextField
        onChange={onChange}
        sx={Object.assign(
          {},
          {
            ...StyledTextFieldClasses,
            ...sx,
          },
        )}
        value={value}
        variant={variant}
        {...rest}
      />
    </>
  );
};
