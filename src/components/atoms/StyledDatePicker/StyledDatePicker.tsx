import { FC } from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import { StyledDatePickerProps, StyledDatePickerStyles } from './index';

import { Transitions } from '@/components/atoms';

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  validate,
  disabled = false,
  disableFuture = true,
  ...rest
}) => {
  return (
    <>
      <DatePicker
        closeOnSelect
        disabled={disabled}
        disableFuture={disableFuture}
        label={label}
        minDate={null}
        onChange={onChange}
        onError={() => {
          return;
        }}
        slotProps={{
          toolbar: { hidden: true },
          actionBar: { actions: [] },
          desktopPaper: {
            sx: {
              '& .MuiPickersDay-root': {
                '& .Mui-focused': {
                  bgcolor: 'transparent',
                },
                '&:hover': {
                  bgcolor: 'info.darker',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                },
                '&.Mui-selected:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          },
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
        sx={{
          ...StyledDatePickerStyles,
          //'& .MuiPickersDay-root': {
          //  '& .Mui-selected': {
          //    bgcolor: 'primary.darkest',
          //  },
          //},
          '& .MuiDateCalendar-root': {
            bgcolor: 'black',
          },
        }}
        value={value}
        {...rest}
      />
    </>
  );
};
