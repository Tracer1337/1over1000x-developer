import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

export type SuggestionHelperState = {
  from: Element | null;
  to: Element | null;
  setFrom: (from: SuggestionHelperState['from']) => void;
  setTo: (to: SuggestionHelperState['to']) => void;
  reset: () => void;
};

export const suggestionHelperStore = createStore<SuggestionHelperState>(
  (set) => ({
    from: null,
    to: null,
    setFrom: (from) => set({ from }),
    setTo: (to) => set({ to }),
    reset: () => set({ from: null, to: null }),
  }),
);

export const useSuggestionHelperStore = (
  selector: (state: SuggestionHelperState) => any = (store) => store,
) => useStore(suggestionHelperStore, selector);
