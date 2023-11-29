import { POSFont } from '@/styles';

export const StyledHeaderLogoStyles = {
  position: 'relative',
  height: {
    xs: 24,
    md: 32,
  },
  maxHeight: 32,
  '& .logo_name': {
    ...POSFont(24, 600, '32px', 'primary.main'),
  },
} as const;
