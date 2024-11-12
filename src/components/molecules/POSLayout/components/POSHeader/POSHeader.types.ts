import { IRoot } from '@/models/Root';
import { LayoutSceneTypeEnum } from '@/types';

export interface POSHeaderProps {
  scene: LayoutSceneTypeEnum;
  store: IRoot;
  loading?: boolean;
}
