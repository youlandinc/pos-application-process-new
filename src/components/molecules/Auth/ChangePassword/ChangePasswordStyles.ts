import { SxProps } from '@mui/material';
import { POSFlex, POSFont } from '@/styles';

export const ChangePasswordStyles: SxProps = {
  ...POSFlex('center', 'space-between', 'row'),
  width: '100%',
  height: '100%',
  '& .change_password_img': {},
  '& .change_password_form': {
    flex: 1,
    py: 6.5,
    borderRadius: 2,
    width: { lg: '700px', xs: '100%' },
    px: { lg: 4, xs: 3 },
    boxShadow: {
      lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      xs: 'none',
    },
    '& .form_title': {
      fontSize: 'clamp(24px,2.5vw,32px)',
      textAlign: 'center',
    },
    '& .form_body': {
      mt: 3,
      '&>div:nth-of-type(2)': {
        my: 3,
      },
      '&>div:nth-of-type(3)': {
        mb: 3,
      },
      '& button': {
        width: '100%',
      },
    },
    '& .form_foot': {
      mt: 3,
      '& button': {
        width: '100%',
      },
    },
    '& .password_error_list': {
      ...POSFont(12, 600, 1.5, 'success.main'),
      listStyle: 'disc',
      listStylePosition: 'inside',
      p: 0,
      mt: 0.25,
      '& .error_active': {
        color: 'error.main',
        transition: 'color .3s',
      },
    },
  },
} as const;
