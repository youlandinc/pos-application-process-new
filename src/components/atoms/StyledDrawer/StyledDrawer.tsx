import { FC } from 'react';
import { Box, Drawer } from '@mui/material';

import { StyledDrawerProps, StyledDrawerStyles } from './index';

export const StyledDrawer: FC<StyledDrawerProps> = ({
  header,
  content,
  footer,
  maxWidth = 310,
  minWidth = 210,
  sx,
  open,
  ...rest
}) => {
  return (
    <Drawer
      open={open}
      sx={{
        ...StyledDrawerStyles,
        '& .MuiPaper-root': {
          maxWidth,
          minWidth,
        },
        ...sx,
      }}
      {...rest}
    >
      {header && <Box className={'drawer_header'}>{header}</Box>}
      {content && <Box className={'drawer_content'}>{content} </Box>}
      {footer && <Box className={'drawer_footer'}>{footer} </Box>}
    </Drawer>
  );
};
