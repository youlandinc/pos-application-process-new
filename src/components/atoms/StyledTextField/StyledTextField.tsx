import { FC } from 'react';
import { Box, TextField } from '@mui/material';

import { StyledTextFieldClasses, StyledTextFieldTypes } from './index';

export const StyledTextField: FC<StyledTextFieldTypes> = ({
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
            ? validate.map((item) => (
                <>
                  <Box component={'span'} sx={{ display: 'block', m: 0 }}>
                    {item}
                  </Box>
                </>
              ))
            : validate
            ? validate
            : undefined
        }
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
