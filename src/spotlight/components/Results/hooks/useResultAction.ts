import { useEffect } from 'react';
import { useResultFocus } from './useResultFocus';
import { SpotlightResult } from '../types';

export function useResultAction({ results }: { results: SpotlightResult[] }) {
  const focusedResultId = useResultFocus();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || !focusedResultId) {
        return;
      }
      results.find((result) => result.id === focusedResultId)?.action();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedResultId]);
}
