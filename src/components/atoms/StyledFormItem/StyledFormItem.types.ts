import { ReactNode } from 'react';
import { BoxProps, SxProps } from '@mui/material';

export interface StyledFormItemProps extends BoxProps {
  children?: ReactNode;
  sx?: SxProps;
  label: ReactNode;
  labelSx?: SxProps;
  tip?: ReactNode;
  tipSx?: SxProps;
}
