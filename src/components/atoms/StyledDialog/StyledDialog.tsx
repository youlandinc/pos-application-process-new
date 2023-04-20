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
      {header && <Box className="dialog_header">{header}</Box>}
      {content && <Box className="dialog_content">{content} </Box>}
      {footer && <Box className="dialog_footer">{footer} </Box>}
    </Dialog>
  );
};
