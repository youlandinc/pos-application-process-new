import { Box } from '@mui/material';
import { FC, ReactNode, useEffect } from 'react';

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 375,
          minHeight: 667,
          width: '100vw',
          height: '100vh',
        }}
      >
        <StyledLoading sx={{ color: 'text.grey' }} />
      </Box>
    ) : (
      <POSLayout scene={'pipeline'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
