import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export const useBreakpoints = (
  fnc: typeof useMediaQuery = useMediaQuery,
): Breakpoint => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      const matches = fnc(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
};
