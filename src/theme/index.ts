import { createTheme } from '@mui/material/styles';

const CONSTANT_COLOR_HUE = 222;
//const CONSTANT_COLOR_SATURATION = 42;
//const CONSTANT_COLOR_LIGHTNESS = 55;

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

declare module 'notistack' {
  interface OptionsObject {
    isSimple?: boolean;
    header?: string;
  }
}

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

declare module '@mui/material/styles' {
  interface PaletteColor {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
    brightness?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lighter_font?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
    brightness?: string;
    slightly_lighter?: string;
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
    grey: string;
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
      xl: 1366,
      xxl: 1920,
    },
  },
  palette: {
    primary: {
      main: `hsla(${CONSTANT_COLOR_HUE},42%,55%,1)`,
      brightness: `hsla(${CONSTANT_COLOR_HUE},80%,70%,1)`,
      dark: `hsla(${CONSTANT_COLOR_HUE},43%,50%,1)`,
      darker: `hsla(${CONSTANT_COLOR_HUE},38%,30%,1)`,
      darkest: `hsla(${CONSTANT_COLOR_HUE},28%,18%,1)`,
      light: `hsla(${CONSTANT_COLOR_HUE},100%,92%,1)`,
      lighter: `hsla(${CONSTANT_COLOR_HUE},100%,97%,1)`,
      lighter_font: `hsla(${CONSTANT_COLOR_HUE},64%,44%,1)`,
      lightest: `hsla(${CONSTANT_COLOR_HUE},32%,98%,1)`,
      slightly_lighter: `hsla(${CONSTANT_COLOR_HUE},42%,55%,.8)`,
      contrastText: '#FFFFFF',
      contrastHover: '#2B52B6',
      contrastBackground: '#365EC6',
    },
    secondary: {
      main: '#FFFFFF',
      hover: '#F4F6FA',
      background: 'rgba(255,255,255,.1)',
      contrastText: '#5B76BC',
    },
    success: {
      main: '#69C0A5',
      hover: '#43A788',
      background: '#F0F9F6',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#EEB94D',
      hover: '#E39F15',
      background: '#FFF7E6',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DE6449',
      hover: '#CD5135',
      background: '#FFEEEA',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#9095A3',
      hover: '#81889B',
      contrastText: '#FFFFFF',
      darker: 'rgba(144, 149, 163, 0.1)',
    },
    action: {
      default: '#D2D6E1',
      hover: '#F4F6FA',
      disabled: '#BABCBE',
      disabledBackground: '#ffffff',
    },
    text: {
      primary: '#202939',
      secondary: '#9095A3',
      disabled: '#BABCBE',
      hover: '#636A7C',
      focus: '#202939',
      outline: '#D2D6E1',
      white: '#FFFFFF',
      grey: '#E3E3EE',
    },
    background: {
      border_default: '#D2D6E1',
      border_focus: '#202939',
      border_hover: '#202939',
      broder_disabled: '#BABCBE',
      white: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
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
      fontSize: 36,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h4: {
      fontSize: 30,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h5: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h7: {
      fontSize: 18,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});
