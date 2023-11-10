import {
  PropsWithChildren,
  createContext,
  createElement,
  useContext,
} from 'react';
import { BehaviorSubject, Subject } from 'rxjs';
import { Settings } from 'shared/storage';

export type SpotlightContextValue = {
  input: string;
  settings: Settings;
  onClose: () => void;
  focus: BehaviorSubject<Element | null>;
  action: Subject<string>;
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
