import { CSSProperties, ReactNode } from 'react';
import { DrawerProps, SxProps } from '@mui/material';

export interface StyledDrawerProps
  extends Omit<
    DrawerProps,
    'maxWidth' | 'width' | 'minWidth' | 'content' | 'header' | 'footer'
  > {
  header?: ReactNode;
  content: ReactNode;
  contentId?: string;
  footer?: ReactNode;
  maxWidth?: CSSProperties['maxWidth'] | Omit<SxProps, 'maxWidth'>;
  minWidth?: CSSProperties['minWidth'] | Omit<SxProps, 'minWidth'>;
  width?: CSSProperties['width'] | Omit<SxProps, 'width'>;
}
