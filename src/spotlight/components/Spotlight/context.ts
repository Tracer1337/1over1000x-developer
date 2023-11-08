import {
  PropsWithChildren,
  createContext,
  createElement,
  useContext,
} from 'react';
import { Settings } from 'shared/storage';

type SpotlightContextValue = {
  input: string;
  settings: Settings;
  onClose: () => void;
};

const SpotlightContext = createContext<SpotlightContextValue | null>(null);

export function SpotlightProvider({
  value,
  children,
}: PropsWithChildren<{ value: SpotlightContextValue }>) {
  return createElement(SpotlightContext.Provider, { value }, children);
}

export function useSpotlight() {
  const value = useContext(SpotlightContext);

  if (!value) {
    throw new Error('useSpotlight called outside provider');
  }

  return value;
}
