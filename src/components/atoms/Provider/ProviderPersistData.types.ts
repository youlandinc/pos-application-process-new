import { ReactNode } from 'react';

import { RootStoreKey } from '@/services/PersistData';

export interface ProviderPersistDataProps {
  rootStoreKeys: RootStoreKey[];
  children?: ReactNode;
}
