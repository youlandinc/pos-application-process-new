import { MutableRefObject, useCallback } from 'react';

export const useRenderPdf = (element: MutableRefObject<HTMLDivElement>) => {
  const renderFile = useCallback(
    (string) => {
      if (!element.current?.shadowRoot) {
        element.current.attachShadow({ mode: 'open' });
      }
      element.current.shadowRoot?.innerHTML = `${string || '123'}`;
    },
    [element],
  );

  return { renderFile };
};
