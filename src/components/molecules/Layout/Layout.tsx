import { FC } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { Header } from './components';
import { LayoutProps, StyledBoxWrap } from '@/components';

export const Layout: FC<LayoutProps> = observer(({ children, scene }) => {
  const store = useMst();

  return (
    <Box sx={{ height: '100%' }}>
      <Header scene={scene} store={store} />
      <StyledBoxWrap>{children}</StyledBoxWrap>
    </Box>
  );
});
