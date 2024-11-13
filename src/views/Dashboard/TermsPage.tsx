import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Terms } from '@/components/organisms';

export const TermsPage: FC = observer(() => {
  return <Terms />;
});
