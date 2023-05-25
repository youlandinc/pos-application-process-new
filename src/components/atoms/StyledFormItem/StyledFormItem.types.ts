import { ReactNode } from 'react';
import { StackProps, SxProps } from '@mui/material';

export interface StyledFormItemProps extends StackProps {
  sub?: boolean;
  children?: ReactNode;
  sx?: SxProps;
  label: ReactNode;
  labelSx?: SxProps;
  tip?: ReactNode;
  tipSx?: SxProps;
}
