import { FC, ReactNode, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useCheckIsLogin } from '@/hooks';

import { StyledBoxWrap } from '@/components/atoms';

import { POSHeader } from './index';

import { LayoutSceneTypeEnum } from '@/types';
import { MessageBox, TasksRightMenu } from '@/components/molecules';

export interface POSLayoutProps {
  children?: ReactNode;
  scene: LayoutSceneTypeEnum;
}

export const POSLayout: FC<POSLayoutProps> = observer(({ children, scene }) => {
  const router = useRouter();

  const store = useMst();
  const {
    dashboardInfo: {
      fetchDashboardInfo,
      loading,
      backToPrevTaskMobile,
      jumpToNextTaskMobile,
      fetchChatMessage,
    },
    notificationDetail,
  } = store;
  const breakpoint = useBreakpoints();

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
  }, [fetchDashboardInfo, router.pathname, router.query?.loanId]);

  useEffect(() => {
    if (notificationDetail.loanIdList.includes(router.query.loanId as string)) {
      fetchChatMessage(router.query.loanId as string, () =>
        store.removeNotificationLoanId(router.query.loanId as string),
      );
    }
  }, [
    fetchChatMessage,
    notificationDetail.loanIdList,
    notificationDetail.loanIdList.length,
    router.query.loanId,
    store,
  ]);

  return (
    <Box sx={{ height: '100%' }}>
      <POSHeader loading={loading} scene={scene} />
      <StyledBoxWrap
        sx={{
          display:
            ['lg', 'xl', 'xxl'].includes(breakpoint) &&
            router.pathname.includes('tasks')
              ? 'flex'
              : 'block',
          flexDirection:
            ['lg', 'xl', 'xxl'].includes(breakpoint) &&
            router.pathname.includes('tasks')
              ? 'row'
              : 'unset',
          justifyContent:
            ['lg', 'xl', 'xxl'].includes(breakpoint) &&
            router.pathname.includes('tasks')
              ? 'space-between'
              : 'unset',
          gap:
            ['lg', 'xl', 'xxl'].includes(breakpoint) &&
            router.pathname.includes('tasks')
              ? 8
              : 0,
          mt: scene === LayoutSceneTypeEnum.application ? 3 : 0,
          position: 'relative',
        }}
      >
        {children}
        {['lg', 'xl', 'xxl'].includes(breakpoint) &&
          router.pathname.includes('tasks') && <TasksRightMenu />}
        {scene === LayoutSceneTypeEnum.dashboard && <MessageBox />}
      </StyledBoxWrap>

      {['xs', 'sm'].includes(breakpoint) &&
        router.pathname.includes('tasks') && (
          <Stack
            alignItems={'center'}
            bgcolor={'#ffffff'}
            borderTop={'1px solid #D2D6E1'}
            bottom={0}
            flexDirection={'row'}
            height={56}
            position={'sticky'}
            zIndex={9}
          >
            <Stack
              alignItems={'center'}
              color={'primary.main'}
              flex={1}
              fontWeight={600}
              height={'100%'}
              justifyContent={'center'}
              onClick={() => backToPrevTaskMobile()}
            >
              Prev
            </Stack>

            <Stack
              bgcolor={'#D2D6E1'}
              borderRadius={2}
              height={56}
              width={'1px'}
            />
            <Stack
              alignItems={'center'}
              color={'primary.main'}
              flex={1}
              fontWeight={600}
              height={'100%'}
              justifyContent={'center'}
              onClick={() => jumpToNextTaskMobile()}
            >
              Next
            </Stack>
          </Stack>
        )}
    </Box>
  );
});
