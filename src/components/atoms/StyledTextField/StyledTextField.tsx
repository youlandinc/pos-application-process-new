import { FC, useEffect, useState } from 'react';
import { Box, OutlinedTextFieldProps, SxProps, TextField } from '@mui/material';

import { StyledTooltip, Transitions } from '@/components/atoms';

import { StyledTextFieldStyles } from './index';
import { useBreakpoints } from '@/hooks';

export interface StyledTextFieldProps
  extends Omit<OutlinedTextFieldProps, 'variant'> {
  validate?: undefined | string[];
  variant?: 'outlined';
  sx?: SxProps;
  disabledAutoFill?: boolean;
  tooltipTitle?: string;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
}

export const StyledTextField: FC<StyledTextFieldProps> = ({
  sx,
  value = '',
  onChange,
  variant = 'outlined',
  validate,
  tooltipTitle = '',
  tooltipSx = { width: '100%' },
  isTooltip = false,
  disabledAutoFill = true,
  ...rest
}) => {
  const breakpoints = useBreakpoints();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isTooltip ? (
    <StyledTooltip
      placement={'top'}
      theme={'main'}
      title={tooltipTitle}
      tooltipSx={tooltipSx}
    >
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
                        pl: 0.5,
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
                  pl: 0.5,
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
        InputProps={{
          ...rest.InputProps,
          autoComplete: disabledAutoFill ? 'off' : '',
        }}
        inputProps={{
          ...rest.inputProps,
          autoComplete: disabledAutoFill ? 'off' : '',
        }}
        onChange={onChange}
        // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
        sx={{
          ...StyledTextFieldStyles,
          ...sx,
        }}
        value={value}
        variant={variant}
        {...rest}
      />
    </StyledTooltip>
  ) : (
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
                      pl: 0.5,
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
                pl: 0.5,
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
      InputProps={{
        ...rest.InputProps,
        autoComplete: disabledAutoFill ? 'off' : '',
      }}
      inputProps={{
        ...rest.inputProps,
        autoComplete: disabledAutoFill ? 'off' : '',
      }}
      onChange={onChange}
      // size={['xs', 'sm', 'md'].includes(breakpoints) ? 'small' : 'medium'}
      sx={{
        ...StyledTextFieldStyles,
        ...sx,
      }}
      value={value}
      variant={variant}
      {...rest}
    />
  );
};
