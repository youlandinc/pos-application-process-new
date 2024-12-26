import { FC, ReactNode } from 'react';

import { observer } from 'mobx-react-lite';

import { LayoutSceneTypeEnum } from '@/types';

import { POSLayout } from '@/components/molecules';

export const DashboardPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    return (
      <>
        <POSLayout scene={LayoutSceneTypeEnum.dashboard}>{children}</POSLayout>
      </>
    );
  },
);
