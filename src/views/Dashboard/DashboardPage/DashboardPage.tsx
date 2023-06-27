import { FC, ReactNode, useEffect } from 'react';

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import { useCheckProcessId } from '@/hooks';

import { StyledLoading } from '@/components/atoms';
import { POSLayout } from '@/components/molecules';

export const DashboardPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    const {
      userSetting: { fetchPipelineStatus, pipelineStatusInitialized },
    } = useMst();

    useCheckProcessId();

    // await fetch user setting
    useEffect(() => {
      fetchPipelineStatus();
    }, [fetchPipelineStatus]);

    return !pipelineStatusInitialized ? (
      <StyledLoading sx={{ color: 'primary.main' }} />
    ) : (
      <POSLayout scene={'dashboard'}>
        <>{children}</>
      </POSLayout>
    );
  },
);
