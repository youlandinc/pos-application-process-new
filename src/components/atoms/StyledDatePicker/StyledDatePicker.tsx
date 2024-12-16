import { FC } from 'react';
import { Box, SxProps } from '@mui/material';
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import { DatePicker } from '@mui/x-date-pickers';

import { StyledDatePickerStyles } from './index';

import { StyledTooltip, Transitions } from '@/components/atoms';

export interface StyledDatePickerProps {
  label?: string;
  value: unknown;
  onChange: (
    value: unknown,
    context: PickerChangeHandlerContext<unknown>,
  ) => void;
  onChangeError?: (error: string | undefined) => void;
  validate?: string[];
  disabled?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: Date;
  maxDate?: Date;
  sx?: SxProps;
  tooltipTitle?: string;
  tooltipSx?: SxProps;
  isTooltip?: boolean;
}

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  validate,
  disabled = false,
  disableFuture = true,
  tooltipTitle = '',
  tooltipSx = { width: '100%' },
  isTooltip = false,
  sx = {},
  ...rest
}) => {
  return isTooltip ? (
    <StyledTooltip
      placement={'top'}
      theme={'main'}
      title={tooltipTitle}
      tooltipSx={tooltipSx}
    >
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
            ),
            error: !!validate?.length,
          },
        }}
        sx={Object.assign(
          {
            ...StyledDatePickerStyles,
            '& .MuiDateCalendar-root': {
              bgcolor: '#000000',
            },
          },
          sx,
        )}
        value={value}
        {...rest}
      />
    </StyledTooltip>
  ) : (
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
          ),
          error: !!validate?.length,
        },
      }}
      sx={Object.assign(
        {
          ...StyledDatePickerStyles,
          '& .MuiDateCalendar-root': {
            bgcolor: '#000000',
          },
        },
        sx,
      )}
      value={value}
      {...rest}
    />
  );
};
