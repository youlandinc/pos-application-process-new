import { POSFlex } from '@/styles';

export const LoginStyles = {
  px: {
    xl: '12.5vw',
    lg: 10,
    md: 0,
  },
  minHeight: '100vh',
  ...POSFlex('center', 'space-between', undefined),
  '& .sign_in_img': {
    minWidth: {
      lg: 300,
      md: 0,
    },
    width: {
      lg: 'calc(100% - 748px)',
      sm: 0,
    },
    minHeight: 460,
  },
  '& .sign_in_form': {
    flex: 1,
    boxShadow: {
      lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      md: 'none',
    },
    px: {
      lg: 4,
      md: 3,
      sm: 3,
      xs: 3,
    },
    py: 6.5,
    width: {
      lg: '700px',
      xs: '100%',
    },
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
