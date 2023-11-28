import { IRoot } from '@/models/Root';

export interface MyAccountButtonProps {
  scene: 'application' | 'pipeline' | 'dashboard' | 'pipeline_without_all';
  store: IRoot;
}
