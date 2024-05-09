import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Overview } from '@/components/organisms';

export const OverviewPage: FC = observer(() => {
  return <Overview />;
});
