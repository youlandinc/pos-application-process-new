import { ReactNode } from 'react';

export interface POSLayoutProps {
  children?: ReactNode;
  scene: 'application' | 'pipeline' | 'dashboard' | 'pipeline_without_all';
}
