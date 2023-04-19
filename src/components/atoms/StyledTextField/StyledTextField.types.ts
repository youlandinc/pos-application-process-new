import { OutlinedTextFieldProps } from '@mui/material';

export interface StyledTextFieldProps
  extends Omit<OutlinedTextFieldProps, 'variant'> {
  validate?: undefined | string[];
  variant?: 'outlined';
}
