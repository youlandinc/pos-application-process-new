import { POSFlex } from '@/styles';

export const LoginStyles = {
  form: {
    '&.form_body': {
      mt: 3,
      '&>div:nth-of-type(2)': {
        my: 3,
      },
      '& button': {
        width: '100%',
      },
    },
  },
  login: {
    ...POSFlex('center', 'space-between', 'row'),
    width: '100%',
    height: '100%',
    maxWidth: 700,
    pb: 11.5,
    '& .sign_in_img': {},
    '& .sign_in_form': {
      flex: 1,
      textAlign: 'center',
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
      },
      '& .form_body': {
        mt: 3,
        '&>div:nth-of-type(2)': {
          my: 3,
        },
        '& button': {
          width: '100%',
        },
      },
      '& .form_foot': {
        mt: 3,
        textAlign: 'center',
        ...POSFlex('unset', 'space-between', { lg: 'inherit', xs: 'column' }),
      },
    },
  },
} as const;

export const LoginFormStyles = {
  '&.form_body': {
    mt: 3,
    '&>div:nth-of-type(2)': {
      my: 3,
    },
    '& button': {
      width: '100%',
    },
  },
} as const;
