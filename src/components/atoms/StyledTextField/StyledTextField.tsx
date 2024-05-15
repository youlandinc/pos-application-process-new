import { FC, useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';

import { Transitions } from '@/components/atoms';

import { StyledTextFieldProps, StyledTextFieldStyles } from './index';

export const StyledTextField: FC<StyledTextFieldProps> = ({
  sx,
  value = '',
  onChange,
  variant = 'outlined',
  validate,
  ...rest
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <TextField
        error={!!(validate?.length && validate[0])}
        FormHelperTextProps={{
          // BUG :libraries,mui types bug
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          component: 'div',
        }}
        helperText={
          isClient ? (
            <Transitions>
              {validate?.length
                ? validate.map((item, index) => (
                    <Box
                      component={'span'}
                      key={item + '_' + index}
                      sx={{
                        display: 'block',
                        m: 0,
                        '&:first-of-type': {
                          mt: 0.5,
                        },
                      }}
                    >
                      {item}
                    </Box>
                  ))
                : validate
                  ? validate
                  : undefined}
            </Transitions>
          ) : validate?.length ? (
            validate.map((item, index) => (
              <Box
                component={'span'}
                key={item + '_' + index}
                sx={{
                  display: 'block',
                  m: 0,
                  '&:first-of-type': {
                    mt: 0.5,
                  },
                }}
              >
                {item}
              </Box>
            ))
          ) : validate ? (
            validate
          ) : undefined
        }
        // InputLabelProps={{ shrink: true }}
        onChange={onChange}
        sx={{
          ...StyledTextFieldStyles,
          ...sx,
        }}
        value={value}
        variant={variant}
        {...rest}
      />
    </>
  );
};
