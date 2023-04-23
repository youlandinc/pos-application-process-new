import { IRoot } from '@/models/Root';

export interface HeaderProps {
  scene: 'application' | 'pipeline' | 'dashboard';
  store: IRoot;
}
