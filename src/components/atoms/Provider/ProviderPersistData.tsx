import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { usePersisData } from '@/hooks';
import { ProviderPersistDataProps } from './index';

export const ProviderPersistData: FC<ProviderPersistDataProps> = observer(
  (props) => {
    //usePersisData(props.rootStoreKeys);
    return <>{props.children}</>;
  },
);
