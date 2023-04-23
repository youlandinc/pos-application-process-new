import { FC } from 'react';
import { Box } from '@mui/material';

import { HeaderProps, HeaderStyles } from './index';
import { POSFlex } from '@/styles';
import { StyledHeaderLogo } from '@/components';

export const Header: FC<HeaderProps> = () => {
  //const renderButton = useMemo(() => {
  //  switch(){
  //
  //  }
  //}, []);

  return (
    <Box
      sx={{
        ...POSFlex('center', 'center', 'row'),
      }}
    >
      <Box
        sx={{
          ...POSFlex('center', 'flex-start', 'row'),
          border: '1px solid',
          height: 92,
          width: {
            xl: 1440,
            lg: 938,
            xs: '100%',
          },
        }}
      >
        <StyledHeaderLogo />
        <Box sx={{ ml: 'auto', border: '1px solid' }}>234</Box>
      </Box>
    </Box>
  );
};
