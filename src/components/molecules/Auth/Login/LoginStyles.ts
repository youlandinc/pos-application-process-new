import { POSFlex } from '@/styles';

export const LoginStyles = {
  px: {
    lg: '15.5vw',
    md: 0,
  },
  height: '100vh',
  ...POSFlex('center', 'space-between', undefined),
  '& .sign_in_img': {
    minWidth: {
      lg: 300,
      md: 0,
    },
    width: {
      lg: 'calc(100% - 748px)',
      md: 0,
      sm: 0,
    },
    height: 460,
  },
  '& .sign_in_form': {
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
      md: '100%',
      sm: '100%',
      xs: '100%',
    },
    textAlign: 'center',
    '& .form_title': {
      fontSize: {
        md: 32,
        sm: 24,
      },
    },
    '& .form_foot': {
      mt: 3,
      textAlign: 'center',
      ...POSFlex('', 'space-between', undefined),
      flexFlow: {
        lg: 'inherit',
        md: 'column',
        sm: 'column',
        xs: 'column',
      },
    },
  },
};
