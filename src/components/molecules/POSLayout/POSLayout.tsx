import { FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useCheckIsLogin } from '@/hooks';

import { POSLayoutProps } from './index';
import { POSHeader } from './components/POSHeader';
import { DashboardMenuList } from './components/DashboardMenuList';

import { LayoutSceneTypeEnum } from '@/types';

import { StyledBoxWrap } from '@/components/atoms';

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
  const breakpoint = useBreakpoints();
  const router = useRouter();

  const store = useMst();
  const {
    dashboardInfo: { fetchDashboardInfo, loading },
  } = store;

  useCheckIsLogin();
  //useCheckInfoIsComplete();

  useEffect(() => {
    if (
      !router.pathname.includes('pipeline') &&
      router.pathname.includes('dashboard') &&
      router.query.loanId
    ) {
      fetchDashboardInfo(router.query.loanId as string);
    }
  }, [fetchDashboardInfo, router.pathname, router.query.loanId]);

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
                info={store.dashboardInfo}
                loading={loading}
                scene={scene}
              />
            </Box>
          )}
        {children}
      </StyledBoxWrap>
    </Box>
  );
});
