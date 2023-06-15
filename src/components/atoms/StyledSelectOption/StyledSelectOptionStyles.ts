import { POSFlex, POSFont } from '@/styles';

export const StyledSelectOptionStyles = {
  ...POSFlex('center', 'center', 'row'),
  ...POSFont({ xs: 16, md: 20 }, 600, 1.5, 'text.primary'),
  cursor: 'pointer',
  height: 64,
  width: '100%',
  maxWidth: 600,
  border: '2px solid #C5D1FF',
  borderRadius: 2,
  transition: 'all .3s',
  textAlign: 'center',
  '&:hover': {
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: '#C5D1FF',
    color: 'primary.main',
    borderColor: 'primary.main',
  },
  '&.disabled': {
    borderColor: 'info.main',
    color: 'info.main',
    bgcolor: 'transparent',
    cursor: 'not-allowed',
  },
  '&.disabled.active': {
    bgcolor: '#CDCDCD',
    cursor: 'not-allowed',
  },
} as const;
