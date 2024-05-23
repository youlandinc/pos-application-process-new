import { FC, ReactNode } from 'react';

import { observer } from 'mobx-react-lite';

import { LayoutSceneTypeEnum } from '@/types';

import { POSLayout } from '@/components/molecules';

export const AccountPage: FC<{ children?: ReactNode }> = observer(
  ({ children }) => {
    return (
      <POSLayout scene={LayoutSceneTypeEnum.account}>
        <>{children}</>
      </POSLayout>
    );
  },
);
