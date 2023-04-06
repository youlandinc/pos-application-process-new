import { CSSProperties } from 'react';

export const POSFont = <
  S extends CSSProperties['fontSize'],
  W extends CSSProperties['fontWeight'],
  L extends CSSProperties['lineHeight'],
  C extends CSSProperties['color'],
>(
  fontSize?: S,
  fontWeight?: W,
  lineHeight?: L,
  color?: C,
): {
  fontSize?: S;
  fontWeight?: W;
  lineHeight?: L;
  color?: C;
} => {
  return {
    fontSize,
    fontWeight,
    lineHeight,
    color,
  };
};

export const POSFlex = <
  A extends CSSProperties['alignItems'],
  J extends CSSProperties['justifyContent'],
  D extends CSSProperties['flexDirection'],
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

export const POSSize = <T extends number | string, X extends number | string>(
  width: T,
  height?: X,
): { width: T; height: X | T } => {
  return {
    width,
    height: height || width,
  };
};
