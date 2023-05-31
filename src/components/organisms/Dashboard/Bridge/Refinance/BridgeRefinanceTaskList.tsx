import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TaskList } from '@/components/molecules';

export const BridgeRefinanceTaskList: FC = observer(() => {
  return <TaskList />;
});
