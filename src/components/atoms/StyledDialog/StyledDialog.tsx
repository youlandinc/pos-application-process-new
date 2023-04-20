import React, { FC } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { StyledDialogProps, StyledDialogStyles } from './index';

export const StyledDialog: FC<StyledDialogProps> = ({
  header,
  content,
  footer,
  sx,
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
      {header && <DialogTitle>{header}</DialogTitle>}
      {content && <DialogContent>{content} </DialogContent>}
      {footer && <DialogActions>{footer} </DialogActions>}
    </Dialog>
  );
};
