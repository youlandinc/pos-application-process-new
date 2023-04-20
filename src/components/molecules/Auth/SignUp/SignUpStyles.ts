import { POSFlex, POSFont } from '@/styles';

export const SignUpStyles = {
  ...POSFlex('center', 'space-between', 'row'),
  minHeight: '100vh',
  p: {
    xl: 27.5,
    lg: 10,
    md: 5,
  },
  '& .sign_up_img': {
    display: { xs: 'none', lg: 'block' },
    minHeight: 460,
    minWidth: 300,
    width: 'calc(100% - 748px)',
    height: 'auto',
  },
  '& .sign_up_form': {
    flex: 1,
    py: 6.5,
    borderRadius: 2,
    px: { lg: 4, xs: 3 },
    width: { lg: '700px', xs: '100%' },
    boxShadow: {
      lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      md: 'none',
    },
    '& .form_body': {
      mt: 3,
      '&>div:nth-child(even)': {
        my: 3,
      },
      '& button': {
        width: '100%',
      },
    },
    '& .form_title': {
      textAlign: 'center',
      fontSize: {
        md: 32,
        sm: 24,
      },
    },
    '& .form_foot': {
      mt: 3,
      textAlign: 'center',
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
};
