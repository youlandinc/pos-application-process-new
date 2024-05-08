import { FC } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useCheckIsLogin } from '@/hooks';

import { POSLayoutProps } from './index';
import { POSHeader } from './components/POSHeader';
import { LayoutSceneTypeEnum } from '@/types';

import { StyledBoxWrap } from '@/components/atoms';
import { DashboardMenuList } from '@/components/molecules';

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
  const store = useMst();
  //const {
  //  selectedProcessData: { fetchProcessData, loading },
  //} = store;
  const breakpoint = useBreakpoints();
  const router = useRouter();
  useCheckIsLogin();
  //useCheckInfoIsComplete();

  //useEffect(() => {
  //  if (!router.pathname.includes('pipeline') && router.query.processId) {
  //    fetchProcessData(router.query.processId);
  //  }
  //}, [fetchProcessData, router.pathname, router.query.processId]);

  return (
    <Box sx={{ height: '100%' }}>
      <POSHeader scene={scene} store={store} />
      <StyledBoxWrap
        sx={{
          display:
            scene === LayoutSceneTypeEnum.dashboard ||
            scene === LayoutSceneTypeEnum.pipeline
              ? 'flex'
              : 'block',
          flexDirection:
            scene === LayoutSceneTypeEnum.dashboard ? 'row' : 'column',
        }}
      >
        {scene === LayoutSceneTypeEnum.dashboard &&
          ['lg', 'xl', 'xxl'].includes(breakpoint) && (
            <Box sx={{ minWidth: 280 }}>
              <DashboardMenuList
                // info={store.selectedProcessData}
                // loading={loading}
                scene={scene}
              />
            </Box>
          )}
        {children}
      </StyledBoxWrap>
    </Box>
  );
});
