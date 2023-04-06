import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface TypeText {}

  interface TypeBackground {
    primary: string;
    primary_hover: string;
    success_hover: string;
    secondary_hover: string;
    warning_hover: string;
    error_hover: string;
  }
  interface TypeAction {
    default: string;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1134E3',
    },
    secondary: {
      main: '#F3D370',
    },
    success: {
      main: '#36B37E',
      contrastText: '#fff',
    },
    warning: {
      main: '#FFAB00',
      contrastText: '#fff',
    },
    error: {
      main: '#FF5630',
    },
    info: {
      main: '#9095A3',
    },
    action: {
      default: '#D2D6E1',
      focus: '#202939',
      hover: '#636A7C',
      disabled: '#CDCDCD',
    },
    text: {},
    background: {
      primary_hover: '#0C249F',
      success_hover: '#0A5554',
      secondary_hover: '#D9B239',
      warning_hover: '#7A4100',
      error_hover: '#7A0916',
    },
  },
  typography: {
    fontFamily: 'Poppins, "pingfang sc", sans-serif',
  },
});
