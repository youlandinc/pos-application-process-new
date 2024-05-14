import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Documents } from '@/components/organisms';

export const DocumentsPage: FC = observer(() => {
  return <Documents />;
});
