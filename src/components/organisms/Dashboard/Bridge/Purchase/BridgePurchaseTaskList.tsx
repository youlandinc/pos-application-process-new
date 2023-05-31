import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TaskList } from '@/components/molecules';

export const BridgePurchaseTaskList: FC = observer(() => {
  return <TaskList />;
});
