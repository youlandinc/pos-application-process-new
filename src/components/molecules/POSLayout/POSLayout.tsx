import { FC } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSLayoutProps } from './index';
import { POSHeader } from './components/POSHeader';
import { StyledBoxWrap } from '@/components';

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
  const store = useMst();

  return (
    <Box sx={{ height: '100%' }}>
      <POSHeader scene={scene} store={store} />
      <StyledBoxWrap>{children}</StyledBoxWrap>
    </Box>
  );
});