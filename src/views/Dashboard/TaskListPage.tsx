import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { Tasks } from '@/components/organisms';

export const TaskListPage: FC = observer(() => {
  return <Tasks />;
});
