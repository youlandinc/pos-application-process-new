import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksEntitlements } from '@/components/molecules';

export const TasksEntitlementsPage: FC = observer(() => {
  return <TasksEntitlements />;
});
