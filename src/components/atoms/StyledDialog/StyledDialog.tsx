import React, { FC } from 'react';
import { Box, Dialog } from '@mui/material';

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
      {header && <Box className="dialog-header">{header}</Box>}
      {content && <Box className="dialog-content">{content} </Box>}
      {footer && <Box className="dialog-footer">{footer} </Box>}
    </Dialog>
  );
};
