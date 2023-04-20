import { FC } from 'react';
import { Box } from '@mui/material';

import { StyledBoxWrapProps, StyledBoxWrapStyles } from './index';

export const StyledBoxWrap: FC<StyledBoxWrapProps> = ({ sx, children }) => {
  return (
    <Box sx={StyledBoxWrapStyles.outside}>
      <Box
        sx={{
          ...StyledBoxWrapStyles.inside,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
