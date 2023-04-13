import { SelectProps, SxProps } from '@mui/material';

export interface StyledSelectProps extends SelectProps {
  id: string;
  validate?: undefined | string[];
  options: Option[];
  sxHelperText?: SxProps;
  sxList?: SxProps;
}
