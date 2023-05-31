import { MutableRefObject, useCallback } from 'react';

export const useRenderPdf = (
  element: MutableRefObject<HTMLDivElement | null>,
) => {
  const renderFile = useCallback(
    (string: string) => {
      if (!element.current?.shadowRoot) {
        element.current?.attachShadow({ mode: 'open' });
      }
      (element.current?.shadowRoot as ShadowRoot).innerHTML = `${
        string || '123'
      }`;
    },
    [element],
  );

  return { renderFile };
};
