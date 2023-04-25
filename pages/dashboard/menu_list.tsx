import { FC } from 'react';

import { POSMenuList } from '@/components';
import { useMst } from '@/models/Root';

const POSMenuListPage: FC = () => {
  const { selectedProcessData } = useMst();
  return <POSMenuList info={selectedProcessData} scene={'bridge refinance'} />;
};

export default POSMenuListPage;
