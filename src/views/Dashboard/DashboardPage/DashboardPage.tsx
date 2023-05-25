import { FC, ReactNode, useEffect } from 'react';

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import { StyledLoading } from '@/components/atoms';
import { POSLayout } from '@/components/molecules';

export const DashboardPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    const {
      dashboardTask: { fetchTaskItemStatus },
      userSetting: {
        fetchUserSetting,
        initialized,
        loading,
        fetchPipelineStatus,
        setting: { lastSelectedProcessId },
      },
    } = useMst();

    // await fetch user setting
    useEffect(() => {
      fetchUserSetting();
      fetchPipelineStatus();
    }, [fetchPipelineStatus, fetchUserSetting]);

    // await fetch task item status
    useEffect(() => {
      if (loading || !initialized) {
        return;
      }
      fetchTaskItemStatus(lastSelectedProcessId);
    }, [
      fetchTaskItemStatus,
      fetchUserSetting,
      initialized,
      lastSelectedProcessId,
      loading,
    ]);

    return !initialized ? (
      <StyledLoading />
    ) : (
      <POSLayout scene={'dashboard'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
