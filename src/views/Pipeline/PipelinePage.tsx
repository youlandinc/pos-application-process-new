import { FC, ReactNode } from 'react';

import { observer } from 'mobx-react-lite';

import { LayoutSceneTypeEnum } from '@/types';

import { POSLayout } from '@/components/molecules';

export const PipelinePage: FC<{
  children?: ReactNode;
  scene: LayoutSceneTypeEnum;
}> = observer(
  ({
    children,
    // scene = LayoutSceneTypeEnum.pipeline
  }) => {
    // // await fetch user setting
    // useEffect(() => {
    //   fetchPipelineStatus();
    // }, [fetchPipelineStatus, session]);
    //
    // // await fetch task item status
    // useEffect(() => {
    //   if (userType === UserType.CUSTOMER) {
    //     pipelineTask.setInitialized(true);
    //     return;
    //   }
    //   if (!pipelineTask.pipelineInitialized) {
    //     pipelineTask.initPipelineTaskForm();
    //   }
    //   pipelineTask.fetchPipelineTaskData();
    // }, [
    //   pipelineStatus,
    //   pipelineTask,
    //   pipelineTask.pipelineInitialized,
    //   userType,
    // ]);

    return (
      <POSLayout scene={LayoutSceneTypeEnum.account}>
        <>{children}</>
      </POSLayout>
    );
  },
);
