import {
  createTheme,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface TypeText {}
  
  interface TypeBackground {}
}

const customBreakpoints = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
  },
})

const defaultOptions: ThemeOptions = {
  ...customBreakpoints,
  palette: {
    primary: {
      main: '#1134E3',
    },
    text: {},
    background: {},
  },
  typography: {
    fontFamily: '',
  },
}

// Create a theme instance.
const lightTheme = createTheme(defaultOptions)

const darkTheme = createTheme({
  ...defaultOptions,
  palette: {
    ...defaultOptions.palette,
  }
})

const theme = responsiveFontSizes(lightTheme)

export { lightTheme, darkTheme, theme }
