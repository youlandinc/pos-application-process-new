import { FC } from 'react';
import { Box, TextField } from '@mui/material';

import { StyledTextFieldProps, StyledTextFieldStyles } from './index';

export const StyledTextField: FC<StyledTextFieldProps> = ({
  sx,
  value = '',
  onChange,
  variant = 'outlined',
  validate,
  ...rest
}) => {
  return (
    <>
      <TextField
        error={!!(validate?.length && validate[0])}
        helperText={
          validate?.length
            ? validate.map((item, index) => (
                <Box
                  component={'span'}
                  key={item + '_' + index}
                  sx={{ display: 'block', m: 0 }}
                >
                  {item}
                </Box>
              ))
            : validate
            ? validate
            : undefined
        }
        onChange={onChange}
        sx={Object.assign(
          {},
          {
            ...StyledTextFieldStyles,
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
