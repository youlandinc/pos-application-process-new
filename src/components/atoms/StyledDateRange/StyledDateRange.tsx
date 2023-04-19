import { FC, forwardRef, useRef } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import {
  ArrowDropDown,
  ArrowDropUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';

import { getMonth, getYear } from 'date-fns';
import { range } from 'lodash';

import ReactDatePicker, {
  CalendarContainer,
  CalendarContainerProps,
  ReactDatePickerCustomHeaderProps,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { StyledDateRangeProps, StyledDateRangeStyles } from './index';

import { StyledTextFieldStyles } from '../StyledTextField';
import { useBreakpoints, useSwitch } from '@/hooks';

export const StyledDateRange: FC<StyledDateRangeProps> = ({
  sx,
  label,
  dateRange = [null, null],
  ...rest
}) => {
  const breakpoint = useBreakpoints();

  const inputRef = useRef(null);
  const selected = useRef<any>(null);
  const { visible, close, toggle } = useSwitch(false);

  const onOpen = () => {
    toggle();
    setTimeout(() => {
      selected.current?.scrollIntoView();
    }, 100);
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const years = range(1900, getYear(new Date()) + 100, 1);

  const CustomHeader = ({
    date,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => (
    <>
      <Box
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography onClick={onOpen} variant={'subtitle1'}>
          {months[getMonth(date)]}
          {'  ' + getYear(date)}
          <IconButton>
            {visible ? <ArrowDropDown /> : <ArrowDropUp />}
          </IconButton>
        </Typography>
        {!visible && (
          <Box>
            <IconButton
              disabled={prevMonthButtonDisabled}
              onClick={decreaseMonth}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              disabled={nextMonthButtonDisabled}
              onClick={increaseMonth}
              sx={{
                ml: 3,
              }}
            >
              <KeyboardArrowRight />
            </IconButton>
          </Box>
        )}
      </Box>
      {visible && (
        <Box className="years-box" component={'ul'}>
          {years.map((item) => {
            return (
              <Box
                className={getYear(date) === item ? 'isSelected' : ''}
                component={'li'}
                key={item}
                onClick={() => {
                  changeYear(item);
                  close();
                }}
                ref={getYear(date) === item ? selected : null}
              >
                {item}
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );

  const CustomInput = forwardRef((props: any, ref) => {
    return (
      <>
        <TextField
          sx={StyledTextFieldStyles}
          variant="outlined"
          {...props}
          ref={ref}
        />
      </>
    );
  });

  function Container({ className, children }: CalendarContainerProps) {
    // console.log({ children, className }, children[3][0].props.children[0]);
    return (
      <CalendarContainer className={className}>
        <div style={{ position: 'relative' }}>
          {/* {children[3][0].props.children[0].props.children[0]} */}
          {visible
            ? children &&
              (children as unknown as any)[3][0]?.props.children[0].props
                .children[0]
            : children}
        </div>
      </CalendarContainer>
    );
  }

  return (
    <Box
      sx={{
        ...StyledDateRangeStyles,
        ...sx,
      }}
    >
      <ReactDatePicker
        calendarContainer={Container}
        customInput={<CustomInput inputRef={inputRef} label={label} />}
        endDate={dateRange[1]}
        renderCustomHeader={CustomHeader}
        selectsRange={true}
        startDate={dateRange[0]}
        withPortal={['xs', 'sm'].includes(breakpoint)}
        {...rest}
      >
        {rest.children}
      </ReactDatePicker>
    </Box>
  );
};
