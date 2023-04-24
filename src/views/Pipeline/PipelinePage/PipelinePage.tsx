import { StyledLoading } from '@/components/atoms/StyledLoading';
import { FC, ReactNode, useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { UserType } from '@/types';

import { POSLayout } from '@/components';

export const PipelinePage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    const {
      userType,
      pipelineTask,
      userSetting: { fetchUserSetting, initialized, fetchPipelineStatus },
    } = useMst();

    // await fetch user setting
    useEffect(() => {
      fetchUserSetting();
      fetchPipelineStatus();
    }, [fetchUserSetting, fetchPipelineStatus]);

    // await fetch task item status
    useEffect(() => {
      if (userType === UserType.CUSTOMER || !initialized) {
        return;
      }
      if (!pipelineTask.pipelineInitialized) {
        pipelineTask.initPipelineTaskForm();
      }
      pipelineTask.fetchPipelineTaskData();
    }, [pipelineTask, pipelineTask.pipelineInitialized, initialized, userType]);

    return !initialized && !pipelineTask.pipelineInitialized ? (
      <StyledLoading />
    ) : (
      <POSLayout scene={'pipeline'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
