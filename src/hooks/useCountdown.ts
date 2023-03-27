import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountdown = (duration: number) => {
  const [current, setCurrent] = useState(duration);
  const [running, setRunning] = useState(false);

  const timer = useRef<ReturnType<typeof setInterval>>();

  const stop = useCallback(() => {
    clearInterval(timer.current);
    timer.current = undefined;
    setRunning(false);
    setCurrent(duration);
  }, [duration]);

  const start = useCallback(() => {
    timer.current = setInterval(() => {
      setCurrent((old) => {
        const newValue = old - 1;

        if (newValue <= 0) {
          stop();
        }

        return newValue;
      });
    }, 1000);
    setRunning(true);
  }, [stop]);

  useEffect(() => stop, [stop]);

  return {
    current,
    start,
    running,
  };
};
