import React, { FC } from 'react';
import { Dialog, DialogTitle } from '@mui/material';

import { StyledDialogProps, StyledDialogStyles } from './index';

export const StyledDialog: FC<StyledDialogProps> = ({
  Title,
  sx,
  children,
  handleClose,
  open,
  ...rest
}) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={Object.assign({
        ...StyledDialogStyles,
        ...sx,
      })}
      {...rest}
    >
      {Title && <DialogTitle>{Title}</DialogTitle>}
      {children}
    </Dialog>
  );
};
