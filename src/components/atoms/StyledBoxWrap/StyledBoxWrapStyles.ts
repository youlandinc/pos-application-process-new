import { POSFlex } from '@/styles';

export const StyledBoxWrapStyles = {
  outside: {
    ...POSFlex('center', 'center', 'row'),
  },
  inside: {
    minHeight: '100vh',
    width: {
      xl: 1440,
      lg: 938,
      xs: '100%',
    },
    py: 'clamp(40px,7vw,80px) ',
    px: {
      lg: 0,
      xs: 'clamp(24px,6.4vw,80px)',
    },
  },
} as const;
