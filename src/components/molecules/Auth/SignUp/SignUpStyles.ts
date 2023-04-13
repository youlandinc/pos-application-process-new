import { POSFlex } from '@/styles';

export const SignUpStyles = {
  px: {
    md: '15.5vw',
    sm: 0,
  },
  ...POSFlex('center', 'space-between', undefined),
  // display: 'flex',
  // justifyContent: 'space-between',
  mt: 18,
  '& .sign_up_img': {
    width: {
      md: '48%',
      sm: 0,
    },
    height: '348px',
    backgroundImage: "url('/sign_up.svg')",
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
  },
  '& .sign_up_form': {
    boxShadow: {
      md: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      sm: 'none',
    },
    px: {
      md: 4,
      sm: 3,
      xs: 3,
    },
    py: 6.5,
    width: {
      md: '48%',
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
      // display: 'flex',
      mt: 3,

      textAlign: 'center',
      // justifyContent: 'space-between',
      // ...POSFlex('', 'space-between', undefined),
      // flexFlow: {
      //   md: 'inherit',
      //   sm: 'column',
      //   xs: 'column',
      // },
    },
  },
};
