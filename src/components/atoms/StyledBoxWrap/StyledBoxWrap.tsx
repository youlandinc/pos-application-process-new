import { FC } from 'react';
import { Box } from '@mui/material';

import { POSFlex } from '@/styles';

import { StyledBoxWrapProps } from './index';

export const StyledBoxWrap: FC<StyledBoxWrapProps> = ({ sx, children }) => {
  return (
    <Box sx={{ ...POSFlex('center', 'center', 'row') }}>
      <Box
        sx={{
          minHeight: { xs: 'calc(100vh - 134px)', lg: 'calc(100vh - 152px)' },
          width: {
            xxl: 1440,
            xl: 1240,
            lg: 976,
            xs: '100%',
          },
          py: 'clamp(24px,6.4vw,48px)',
          px: {
            lg: 0,
            xs: 'clamp(24px,6.4vw,60px)',
          },
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
