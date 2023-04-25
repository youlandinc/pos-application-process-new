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
  const handledClass = (name: string) => {
    switch (name) {
      // case 'contained':
      //   return props.color + '.A100';
      case 'dialog_header':
        return `dialog_header ${content || footer ? '' : ' POS_pb_3'}`;

      case 'dialog_content':
        return `dialog_content ${header ? '' : ' POS_pt_3'} ${
          footer ? '' : ' POS_pb_3'
        }`;

      case 'dialog_footer':
        return `dialog_footer ${content || header ? '' : ' POS_pt_3'}`;
    }
  };

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
      {header && <Box className={handledClass('dialog_header')}>{header}</Box>}
      {content && (
        <Box className={handledClass('dialog_content')}>{content} </Box>
      )}
      {footer && <Box className={handledClass('dialog_footer')}>{footer} </Box>}
    </Dialog>
  );
};
