import { ReactNode } from 'react';

export interface POSLayoutProps {
  children?: ReactNode;
  scene: 'application' | 'pipeline' | 'dashboard';
}
