import { SxProps } from '@mui/material';
import { ReactDatePickerProps } from 'react-datepicker';

export interface StyledDateRangeProps
  extends Omit<ReactDatePickerProps, 'onChange'> {
  sx?: SxProps;
  dateRange: [Date | null, Date | null];
  onChange: (
    date: [Date | null, Date | null],
    event: React.SyntheticEvent<any> | undefined,
  ) => void;
}
