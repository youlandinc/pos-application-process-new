import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Tasks } from '@/components/organisms';

export const TaskListPage: FC = observer(() => {
  return <Tasks />;
});
