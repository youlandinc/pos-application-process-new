import { FC, ReactNode, useEffect } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { UserType } from '@/types';

import { StyledLoading } from '@/components/atoms';
import { POSLayout } from '@/components/molecules';

export const PipelinePage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    const {
      userType,
      pipelineTask,
      userSetting: { fetchPipelineStatus, pipelineStatus },
      session,
    } = useMst();

    // await fetch user setting
    useEffect(() => {
      if (session) {
        fetchPipelineStatus();
      }
    }, [fetchPipelineStatus, session]);

    // await fetch task item status
    useEffect(() => {
      if (userType === UserType.CUSTOMER) {
        pipelineTask.setInitialized(true);
        return;
      }
      if (session) {
        if (!pipelineTask.pipelineInitialized) {
          pipelineTask.initPipelineTaskForm();
        }
        pipelineTask.fetchPipelineTaskData();
      }
    }, [
      pipelineStatus,
      pipelineTask,
      pipelineTask.pipelineInitialized,
      session,
      userType,
    ]);

    return !pipelineTask.pipelineInitialized ? (
      <Stack
        alignItems={'center'}
        height={'100vh'}
        justifyContent={'center'}
        minHeight={667}
        minWidth={375}
        width={'100vw'}
      >
        <StyledLoading sx={{ color: 'primary.main' }} />
      </Stack>
    ) : (
      <POSLayout scene={'pipeline'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
