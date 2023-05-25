import { IRoot } from '@/models/Root';

export interface MyAccountButtonProps {
  scene: 'application' | 'pipeline' | 'dashboard';
  store: IRoot;
}
