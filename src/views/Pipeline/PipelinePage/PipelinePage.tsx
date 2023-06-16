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
      userSetting: { fetchPipelineStatus },
    } = useMst();

    // await fetch user setting
    useEffect(() => {
      fetchPipelineStatus().then();
    }, [fetchPipelineStatus]);

    // await fetch task item status
    useEffect(() => {
      if (userType === UserType.CUSTOMER) {
        return;
      }
      if (!pipelineTask.pipelineInitialized) {
        pipelineTask.initPipelineTaskForm();
      }
      pipelineTask.fetchPipelineTaskData().then();
    }, [pipelineTask, pipelineTask.pipelineInitialized, userType]);

    return !pipelineTask.pipelineInitialized ? (
      <StyledLoading sx={{ color: 'primary.main' }} />
    ) : (
      <POSLayout scene={'pipeline'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
