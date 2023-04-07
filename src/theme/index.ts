import { createTheme } from '@mui/material/styles';
declare module '@mui/material/styles/createPalette' {
  interface TypeText {}

  interface TypeBackground {}
  interface TypeAction {
    default: string;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1134E3',
      A100: '#0C249F',
      A200: 'rgba(17, 52, 227, 0.2)',
    },
    secondary: {
      main: '#F3D370',
      A100: '#D9B239',
      A200: 'rgba(243, 211, 112, 0.2)',
    },
    success: {
      main: '#36B37E',
      contrastText: '#fff',
      A100: '#0A5554',
      A200: 'rgba(225, 239, 228, 1)',
    },
    warning: {
      main: '#FFAB00',
      contrastText: '#fff',
      A100: '#7A4100',
      A200: 'rgba(255, 171, 0, 0.2)',
    },
    error: {
      main: '#FF5630',
      A100: '#7A0916',
      A200: 'rgba(255, 86, 48, 0.2)',
    },
    info: {
      main: '#9095A3',
      A100: '#636A7C',
      A200: 'rgba(144, 149, 163, 0.2)',
    },
    action: {
      default: '#D2D6E1',
      focus: '#202939',
      hover: '#636A7C',
      disabled: '#CDCDCD',
    },
    text: {},
    background: {},
  },
  typography: {
    fontFamily: 'Poppins, "pingfang sc", sans-serif',
  },
});
