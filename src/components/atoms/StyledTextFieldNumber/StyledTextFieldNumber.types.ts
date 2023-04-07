import { NumberFormatValues } from 'react-number-format';
import { SxProps } from '@mui/material';

export interface StyledTextFieldNumberProps {
  allowNegative?: boolean;
  onValueChange: (values: NumberFormatValues) => void;
  thousandSeparator?: boolean;
  prefix?: string;
  suffix?: string;
  label?: string;
  value: number;
  sx?: SxProps;
  required?: boolean;
  placeholder?: string;
  decimalScale?: number;
}
