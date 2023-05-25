import { POSFlex, POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledPaymentCardStyles: SxProps = {
  ...POSFont(16, 400, 1.5, 'text.primary'),
  borderRadius: 2,
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: 'transparent',
  '& payment_title': {
    fontWeight: 600,
  },
  '& .payment_subtitle': {
    mt: 3,
    color: 'text.secondary',
  },
  '& .payment_summary': {
    ...POSFont(24, 600, 1.5, 'primary.main'),
    textAlign: 'right',
    mt: 6,
  },
  '& .payment_form': {
    mt: 3,
    '& .payment_item_label_flex': {
      flex: 1,
    },
    '& .payment_item_label_fullwidth': {
      width: '100%',
    },
    '& .payment_item_error': {
      color: 'error.main',
      fontSize: 12,
      mt: 1.5,
    },
    '& .payment_form_inner_wrap': {
      ...POSFlex('flex-start', 'space-between', 'row'),
      width: '100%',
      mt: 3,
      gap: 3,
    },
  },
};
