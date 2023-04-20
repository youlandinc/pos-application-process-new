import { ReactNode } from 'react';
import { DialogProps } from '@mui/material';

export interface StyledDialogProps extends Omit<DialogProps, 'maxWidth'> {
  customHeader?: string | ReactNode;
  customContent?: string | ReactNode;
  customFooter?: string | ReactNode;
}
