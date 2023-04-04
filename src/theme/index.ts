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
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1134E3',
    },
    secondary: {
      main: '#F3D370',
    },
    text: {
      constant_primary: 'rgba(0,0,0,.87)',
      primary: 'rgba(0,0,0,.87)',
      secondary: 'rgba(0,0,0,.6)',
      disabled: 'rgba(0,0,0,.38)',
      white_40: 'rgba(255,255,255,.4)',
      white_60: 'rgba(255,255,255,.6)',
      white: 'rgba(255,255,255,1)',
      yellow_hover: '#FFE492',
      yellow_title: '#F3D370',
      blue_title: '#1134E3',
      blue_dark: '#041256',
    },
  },
  //},
  //  dark: {
  //    palette: {
  //      primary: cyan,
  //      secondary: orange,
  //      text: {
  //        constant_primary: 'rgba(0,0,0,.87)',
  //        primary: 'rgba(0,0,0,.87)',
  //        secondary: 'rgba(0,0,0,.6)',
  //        disabled: 'rgba(0,0,0,.38)',
  //        white_40: 'rgba(255,255,255,.4)',
  //        white_60: 'rgba(255,255,255,.6)',
  //        white: 'rgba(255,255,255,1)',
  //        yellow_hover: '#FFE492',
  //        yellow_title: '#F3D370',
  //        blue_title: '#a134E3',
  //        blue_dark: '#041256',
  //      },
  //    },
  //  },
  //},
  typography: {
    fontFamily: 'Poppins, "pingfang sc", sans-serif',
  },
});
