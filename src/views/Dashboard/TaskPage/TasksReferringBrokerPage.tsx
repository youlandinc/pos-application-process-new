import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TasksReferringBroker } from '@/components/molecules';

export const TasksReferringBrokerPage: FC = observer(() => {
  return <TasksReferringBroker />;
});
