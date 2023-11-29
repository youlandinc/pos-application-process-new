import { IRoot } from '@/models/Root';

export interface POSHeaderProps {
  scene: 'application' | 'pipeline' | 'dashboard' | 'pipeline_without_all';
  store: IRoot;
}
