import { FC, ReactNode, useEffect } from 'react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useCheckIsLogin } from '@/hooks';

import { StyledBoxWrap } from '@/components/atoms';

import { POSHeader } from './index';

import { LayoutSceneTypeEnum } from '@/types';

export interface POSLayoutProps {
  children?: ReactNode;
  scene: LayoutSceneTypeEnum;
}

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
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
      <POSHeader loading={loading} scene={scene} />
      <StyledBoxWrap>{children}</StyledBoxWrap>
    </Box>
  );
});
