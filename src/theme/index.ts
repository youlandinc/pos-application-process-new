import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }

  interface TypographyVariants {
    body3: React.CSSProperties;
    subtitle3: React.CSSProperties;
    h7: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    subtitle3?: React.CSSProperties;
    h7?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtitle3: true;
    h7: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeText {
    white: string;
    primary: string;
    secondary: string;
    disabled: string;
    hover: string;
    focus: string;
    outline: string;
  }

  interface TypeBackground {
    border_default: string;
    border_focus: string;
    border_hover: string;
    broder_disabled: string;
    white: string;
  }

  interface TypeAction {
    default: string;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1440,
      xxl: 1920,
    },
  },
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
      hover: '#F4F6FA',
      disabled: '#CDCDCD',
      disabledBackground: '#ffffff',
    },
    text: {
      primary: '#202939',
      secondary: '#9095A3',
      disabled: '#CDCDCD',
      hover: '#636A7C',
      focus: '#202939',
      outline: '#D2D6E1',
      white: '#FFFFFF',
    },
    background: {
      border_default: '#D2D6E1',
      border_focus: '#202939',
      border_hover: '#202939',
      broder_disabled: '#CDCDCD',
      white: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Poppins, "pingfang sc", sans-serif',
    h1: {
      fontSize: 56,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h2: {
      fontSize: 48,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h3: {
      fontSize: 32,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h4: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h5: {
      fontSize: 20,
      lineHeight: '30px',
      fontWeight: 600,
    },
    h6: {
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 600,
    },
    h7: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 600,
    },
    subtitle3: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: '20px',
      fontWeight: 400,
    },
    body3: {
      fontSize: 12,
      lineHeight: '18px',
      fontWeight: 400,
    },
  },
});
