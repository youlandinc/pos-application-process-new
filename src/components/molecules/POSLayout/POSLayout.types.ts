import { ReactNode } from 'react';
import { LayoutSceneTypeEnum } from '@/types';

export interface POSLayoutProps {
  children?: ReactNode;
  scene: LayoutSceneTypeEnum;
}
