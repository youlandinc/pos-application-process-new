import { POSFont } from '@/styles';
import { SxProps } from '@mui/material';

export const StyledTextFieldPasswordStyles: { [key: string]: SxProps } = {
  error: { color: 'error.main' },
  pass: { color: 'success.main' },
  passwordTips: {
    ...POSFont(12, 700, 1.7, 'rgba(0,0,0,.87)'),
    textAlign: 'left',
  },
};
