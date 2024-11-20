import { BoxProps } from '@mui/material';
import { LayoutSceneTypeEnum } from '@/types';

export interface StyledHeaderLogoProps extends BoxProps {
  logoUrl?: string;
  disabled?: boolean;
  scene?: LayoutSceneTypeEnum;
}
