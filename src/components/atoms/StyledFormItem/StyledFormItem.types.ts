import { ReactNode } from 'react';
import { BoxProps, SxProps } from '@mui/material';

export interface StyledFormItemProps extends BoxProps {
  children?: ReactNode;
  label: ReactNode;
  labelSx?: SxProps;
}
