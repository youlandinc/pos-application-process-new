import { ReactNode } from 'react';
import { DrawerProps } from '@mui/material';

export interface StyledDrawerProps
  extends Omit<DrawerProps, 'maxWidth' | 'content' | 'header' | 'footer'> {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  maxWidth?: string | number;
  minWidth?: string | number;
}
