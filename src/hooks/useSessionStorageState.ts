import { SetStateAction, useCallback, useEffect, useState } from 'react';

export const useSessionStorageState = (key: string) => {
  const [state, setState] = useState(null);

  const removeItem = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  const clear = useCallback(() => {
    sessionStorage.clear();
  }, []);

  const getItem = useCallback(() => {
    if (!sessionStorage) {
      return;
    }
    if (window.sessionStorage.getItem(key)) {
      setState(JSON.parse(window.sessionStorage.getItem(key) as string));
    }

    if (typeof window !== 'undefined') {
      setState(JSON.parse(window.sessionStorage.getItem(key) as string));
    }
  }, [key]);

  const setItem = useCallback(
    (data: SetStateAction<null>) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(data));
        setState(data);
      }
    },
    [key],
  );

  useEffect(() => {
    getItem();
  }, [getItem]);

  return {
    state,
    removeItem,
    clear,
    setItem,
  };
};
