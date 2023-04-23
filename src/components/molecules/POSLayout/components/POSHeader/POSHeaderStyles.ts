import { POSFlex } from '@/styles';

export const POSHeaderStyles = {
  ...POSFlex('center', 'flex-start', 'row'),
  height: 92,
  width: {
    xxl: 1440,
    xl: 1240,
    lg: 938,
    xs: '100%',
  },
  px: {
    lg: 0,
    xs: 'clamp(24px,6.4vw,80px)',
  },
} as const;
