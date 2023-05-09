import { FC } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  useBreakpoints,
  useCheckInfoIsComplete,
  useCheckIsLogin,
} from '@/hooks';

import { POSLayoutProps } from './index';
import { POSHeader } from './components/POSHeader';
import { POSMenuList, StyledBoxWrap } from '@/components';
import { SceneType } from '@/types';

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
  const store = useMst();
  const breakpoint = useBreakpoints();
  useCheckIsLogin();
  useCheckInfoIsComplete();

  return (
    <Box sx={{ height: '100%' }}>
      <POSHeader scene={scene} store={store} />
      <StyledBoxWrap
        sx={{
          display: scene === 'dashboard' ? 'flex' : 'block',
        }}
      >
        {scene === 'dashboard' && ['lg', 'xl', 'xxl'].includes(breakpoint) && (
          <Box sx={{ minWidth: 280 }}>
            <POSMenuList
              info={store.selectedProcessData}
              scene={
                store.selectedProcessData.scene || SceneType.bridge_purchase
              }
            />
          </Box>
        )}

        {children}
      </StyledBoxWrap>
    </Box>
  );
});
