import { CSSProperties, ReactNode } from 'react';
import { DrawerProps } from '@mui/material';

export interface StyledDrawerProps
  extends Omit<
    DrawerProps,
    'maxWidth' | 'width' | 'minWidth' | 'content' | 'header' | 'footer'
  > {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  maxWidth?: CSSProperties['maxWidth'];
  minWidth?: CSSProperties['minWidth'];
  width?: CSSProperties['width'];
}
