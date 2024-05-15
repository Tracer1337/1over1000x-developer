import { createContext } from 'react';

export const ElementDesignerContext = createContext<{
  target: HTMLElement | null;
  width: number;
}>({
  target: null,
  width: 1.5,
});
