export const POSCreateDebounceFunction = <T extends unknown[]>(
  fn: (...args: T) => unknown,
  delay: number,
): {
  run: (...args: T) => unknown;
  cancel: () => void;
} => {
  let timer: number | undefined;
  return {
    run: () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, delay);
    },
    cancel: () => {
      if (timer) {
        clearTimeout(timer);
      }
    },
  };
};
