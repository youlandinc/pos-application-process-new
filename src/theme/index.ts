import { ClassesButton } from '@/components/atoms/StyledButton/StyledButtonClasses';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface TypeText {
    constant_primary: string;
    white_60: string;
    white_40: string;
    white: string;
    yellow_hover: string;
    yellow_title: string;
    blue_title: string;
    blue_dark: string;
    placeholder: string;
  }

  interface TypeBackground {
    banner: string;
    white: string;
    icon: string;
    footer: string;
    homepage: string;
    float: string;
    dark: string;
    nav: string;
    accordion_summary: string;
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
    action: {
      default: '#D2D6E1',
      focus: '#202939',
      hover: '#636A7C',
      disabled: '#CDCDCD',
    },
    text: {
      constant_primary: 'rgba(0,0,0,.87)',
      primary: '#202939',
      secondary: 'rgba(0,0,0,.6)',
      disabled: 'rgba(0,0,0,.38)',
      white_40: 'rgba(255,255,255,.4)',
      white_60: 'rgba(255,255,255,.6)',
      white: 'rgba(255,255,255,1)',
      yellow_hover: '#FFE492',
      yellow_title: '#F3D370',
      blue_title: '#1134E3',
      blue_dark: '#041256',
      placeholder: '#9095A3',
    },
  },
  typography: {
    fontFamily: 'Poppins, "pingfang sc", sans-serif',
    h3: {
      fontFamily: 'Roboto',
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Roboto',
      fontSize: 20,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Roboto',
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 600,
    },
  },
});
