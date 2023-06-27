import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledTextFieldPasswordStyles: { [key: string]: SxProps } = {
  passwordTips: {
    pl: 1,
    mt: 1,
    '& li': {
      ...POSFont(12, 400, 1.5, 'info.main'),
      textAlign: 'left',
      listStyle: 'inside',
    },
    '& .pass': {
      color: 'success.main',
    },
    '& .error': {
      color: 'error.main',
    },
  },
};
