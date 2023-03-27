import { useRef } from 'react';
import { useCreation } from './useCreation';

type Fn = (...args: any) => any;

export const useDebounceFn = <T extends Fn>(fn: T, delay = 300) => {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;
  const timerId = useRef<NodeJS.Timeout>();
  const debounced = useCreation(
    () => (args: any) => {
      if (timerId.current !== void 0) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        fnRef.current(args);
      }, delay);
    },
    [],
  );
  // todo cancel & flush
  return {
    run: debounced as T,
  };
};
