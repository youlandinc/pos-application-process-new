import { POSFlex, POSFont } from '@/styles';

export const StyledSelectOptionStyles = {
  ...POSFlex('center', 'center', 'row'),
  ...POSFont({ xs: 16, md: 20 }, 600, 1.5, 'info.dark'),
  cursor: 'pointer',
  height: 64,
  width: '100%',
  maxWidth: 600,
  border: '2px solid',
  borderColor: 'text.secondary',
  borderRadius: 2,
  transition: 'all .3s',
  textAlign: 'center',
  '&:hover': {
    borderColor: 'primary.main',
  },
  '&.active': {
    bgcolor: 'primary.lighter',
    color: 'primary.darker',
    borderColor: 'primary.main',
  },
  '&.disabled': {
    borderColor: '#BABCBE !important',
    color: '#BABCBE !important',
    bgcolor: 'transparent',
    cursor: 'not-allowed',
  },
  '&.disabled.active': {
    bgcolor: '#EDEDED',
    cursor: 'not-allowed',
    color: '#BABCBE !important',
    borderColor: '#BABCBE !important',
  },
  '&.disabled:hover': {
    borderColor: '#BABCBE !important',
  },
} as const;
