import { IRoot } from '@/models/Root';

export interface POSHeaderProps {
  scene: 'application' | 'pipeline' | 'dashboard';
  store: IRoot;
}
