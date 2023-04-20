import { POSFlex } from '@/styles';

export const LoginStyles = {
  ...POSFlex('center', 'space-between', undefined),
  minHeight: '100vh',
  p: {
    xl: 27.5,
    lg: 10,
    md: 5,
  },
  '& .sign_in_img': {
    display: { xs: 'none', lg: 'block' },
    minHeight: 460,
    minWidth: 300,
    width: 'calc(100% - 748px)',
    height: 'auto',
  },
  '& .sign_in_form': {
    flex: 1,
    boxShadow: {
      lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      xs: 'none',
    },
    px: { lg: 4, xs: 3 },
    py: 6.5,
    borderRadius: 2,
    width: { lg: '700px', xs: '100%' },
    textAlign: 'center',
    '& .form_title': {
      fontSize: {
        md: 32,
        sm: 24,
      },
    },
    '& .form_body': {
      mt: 3,
      '&>div:nth-child(2)': {
        my: 3,
      },
      '& button': {
        width: '100%',
      },
    },
    '& .form_foot': {
      mt: 3,
      textAlign: 'center',
      ...POSFlex('', 'space-between', {
        lg: 'inherit',
        xs: 'column',
      }),
    },
  },
};
