import { FC, ReactNode } from 'react';

import { observer } from 'mobx-react-lite';

import { POSLayout } from '@/components/molecules';
import { LayoutSceneTypeEnum } from '@/types';

export const DashboardPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    // useCheckProcessId();

    // const {
    //   userSetting: { fetchPipelineStatus, pipelineStatusInitialized },
    // } = useMst();

    // await fetch user setting
    // useEffect(() => {
    //   fetchPipelineStatus();
    // }, [fetchPipelineStatus]);

    return (
      <POSLayout scene={LayoutSceneTypeEnum.dashboard}>
        <>{children}</>
      </POSLayout>
    );
  },
);
