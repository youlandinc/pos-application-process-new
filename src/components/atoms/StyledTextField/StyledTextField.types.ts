import { OutlinedTextFieldProps } from '@mui/material';

export interface StyledTextFieldTypes
  extends Omit<OutlinedTextFieldProps, 'variant'> {
  validate?: undefined | string[];
  variant?: 'outlined';
}
