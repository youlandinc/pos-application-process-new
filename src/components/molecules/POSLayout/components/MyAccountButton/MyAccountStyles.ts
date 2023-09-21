import { POSFont } from '@/styles';

export const MyAccountStyles = {
  menu_item: {
    ...POSFont(14, 400, 1.5, 'text.primary'),
    width: '100%',
    p: 1.5,
    '&:hover': {
      bgcolor: 'info.dark',
    },
  },
} as const;
