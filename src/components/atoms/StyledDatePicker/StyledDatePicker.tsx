import { FC } from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { StyledDatePickerProps, StyledDatePickerStyles } from './index';
import { theme } from '@/theme';

import { Transitions } from '@/components/atoms';

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  validate,
  ...rest
}) => {
  return (
    <>
      <DatePicker
        closeOnSelect
        desktopModeMediaQuery={theme.breakpoints.up('lg')}
        disableFuture
        label={label}
        minDate={null}
        onChange={onChange}
        onError={() => {
          return;
        }}
        slotProps={{
          toolbar: { hidden: true },
          actionBar: { actions: [] },
          textField: {
            FormHelperTextProps: {
              // BUG :libraries,mui types bug
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              component: 'div',
            },
            helperText: (
              <Transitions>
                {validate?.length
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
                  : undefined}
              </Transitions>
            ),
            error: !!validate?.length,
          },
        }}
        sx={StyledDatePickerStyles}
        value={value}
        {...rest}
      />
    </>
  );
};
