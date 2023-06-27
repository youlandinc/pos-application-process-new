// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRef } from 'react';

export type noop = (...args: any[]) => any;

export const usePersistFn = <T extends noop>(fn: T) => {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>();
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      return fnRef.current?.apply(this, args);
    } as T;
  }

  return persistFn.current;
};
