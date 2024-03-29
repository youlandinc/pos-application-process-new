import { Stack } from '@mui/material';
import { FC, ReactNode, useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { UserType } from '@/types';

import { StyledLoading } from '@/components/atoms';
import { POSLayout } from '@/components/molecules';

export const PipelinePage: FC<{
  children?: ReactNode;
  scene: 'application' | 'pipeline' | 'dashboard' | 'pipeline_without_all';
}> = observer(({ children, scene = 'pipeline' }) => {
  const {
    userType,
    pipelineTask,
    userSetting: { fetchPipelineStatus, pipelineStatus },
    session,
  } = useMst();

  // await fetch user setting
  useEffect(() => {
    fetchPipelineStatus();
  }, [fetchPipelineStatus, session]);

  // await fetch task item status
  useEffect(() => {
    if (userType === UserType.CUSTOMER) {
      pipelineTask.setInitialized(true);
      return;
    }
    if (!pipelineTask.pipelineInitialized) {
      pipelineTask.initPipelineTaskForm();
    }
    pipelineTask.fetchPipelineTaskData();
  }, [
    pipelineStatus,
    pipelineTask,
    pipelineTask.pipelineInitialized,
    userType,
  ]);

  return !pipelineTask.pipelineInitialized ? (
    <Stack
      alignItems={'center'}
      height={'100vh'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100vw'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <POSLayout scene={scene}>
      <>{children}</>
    </POSLayout>
  );
});
