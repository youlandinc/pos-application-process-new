import { FC } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

import { StyledDatePickerProps, StyledDatePickerStyles } from './index';
import { theme } from '@/theme';

export const StyledDatePicker: FC<StyledDatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  ...rest
}) => {
  return (
    <>
      <DatePicker
        closeOnSelect
        desktopModeMediaQuery={theme.breakpoints.up('lg')}
        label={label}
        onChange={onChange}
        slotProps={{
          toolbar: { hidden: true },
          actionBar: { actions: [] },
        }}
        sx={StyledDatePickerStyles}
        value={value}
        {...rest}
      />
    </>
  );
};
