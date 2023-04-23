import { BoxProps } from '@mui/material';
import { ReactNode } from 'react';

export interface StyledBoxWrapProps extends BoxProps {
  children?: ReactNode;
  isHeader?: boolean;
}
