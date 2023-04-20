import React, { FC } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { StyledDialogProps, StyledDialogStyles } from './index';

export const StyledDialog: FC<StyledDialogProps> = ({
  customHeader,
  customContent,
  customFooter,
  sx,
  children,
  open,
  ...rest
}) => {
  return (
    <Dialog
      fullWidth={true}
      open={open}
      sx={Object.assign({
        ...StyledDialogStyles,
        ...sx,
      })}
      {...rest}
    >
      {customHeader && <DialogTitle>{customHeader}</DialogTitle>}
      {customContent && <DialogContent>{customContent} </DialogContent>}
      {customFooter && <DialogActions>{customFooter} </DialogActions>}
      {children}
    </Dialog>
  );
};
