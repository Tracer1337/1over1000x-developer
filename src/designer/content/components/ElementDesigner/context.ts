import { createContext } from 'react';

export const ElementDesignerContext = createContext<{
  target: HTMLElement | null;
  width: number;
  locked: boolean;
}>({
  target: null,
  width: 1.5,
  locked: false,
});
