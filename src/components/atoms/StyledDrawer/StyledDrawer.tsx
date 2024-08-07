import { FC } from 'react';
import { Box, Drawer } from '@mui/material';

import { StyledDrawerProps, StyledDrawerStyles } from './index';

export const StyledDrawer: FC<StyledDrawerProps> = ({
  header,
  content,
  footer,
  maxWidth = 310,
  minWidth = 210,
  width = '100%',
  sx,
  open,
  contentId,
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
          width,
        },
        ...sx,
      }}
      {...rest}
    >
      {header && <Box className={'drawer_header'}>{header}</Box>}
      {content && (
        <Box className={'drawer_content'} id={contentId}>
          {content}
        </Box>
      )}
      {footer && <Box className={'drawer_footer'}>{footer} </Box>}
    </Drawer>
  );
};
