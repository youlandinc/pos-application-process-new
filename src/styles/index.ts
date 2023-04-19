import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

export const POSFlex = <
  A extends CSSProperties['alignItems'] | Omit<SxProps, 'alignItems'>,
  J extends CSSProperties['justifyContent'] | Omit<SxProps, 'justifyContent'>,
  D extends CSSProperties['flexDirection'] | Omit<SxProps, 'flexDirection'>,
>(
  align?: A,
  justify?: J,
  direction?: D,
): {
  display: 'flex';
  alignItems?: A;
  justifyContent?: J;
  flexDirection?: D;
} => {
  return {
    display: 'flex',
    alignItems: align,
    justifyContent: justify,
    flexDirection: direction,
  };
};

export const POSFont = <
  S extends CSSProperties['fontSize'] | Omit<SxProps, 'fontSize'>,
  W extends CSSProperties['fontWeight'] | Omit<SxProps, 'fontWeight'>,
  L extends CSSProperties['lineHeight'] | Omit<SxProps, 'lightHeight'>,
  C extends CSSProperties['color'] | Omit<SxProps, 'color'>,
>(
  fontSize?: S,
  fontWeight?: W,
  lineHeight?: L,
  color?: C,
): {
  color: C | undefined;
  fontSize: S | undefined;
  lineHeight: L | undefined;
  fontWeight: W | undefined;
} => {
  return {
    fontSize,
    fontWeight,
    color,
    lineHeight,
  };
};

export const flexCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const POSSize = <T extends number | string, X extends number | string>(
  width: T,
  height?: X,
): { width: T; height: X | T } => {
  return {
    width,
    height: height || width,
  };
};

export * from './createEmotionCache';
