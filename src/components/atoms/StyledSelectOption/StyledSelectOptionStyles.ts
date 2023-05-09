import { POSFlex, POSFont } from '@/styles';

export const StyledSelectOptionStyles = {
  ...POSFlex('center', 'center', 'row'),
  ...POSFont(20, 600, 1.5, 'text.primary'),
  cursor: 'pointer',
  height: 64,
  width: '100%',
  maxWidth: 600,
  border: '2px solid #C5D1FF',
  borderRadius: 2,
  transition: 'all .3s',
  '&:hover': {
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: '#C5D1FF',
    color: 'primary.main',
    borderColor: 'primary.main',
  },
} as const;
