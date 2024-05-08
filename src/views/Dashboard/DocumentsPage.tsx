import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { Documents } from '@/components/organisms';

export const DocumentsPage: FC = observer(() => {
  return <Documents />;
});
