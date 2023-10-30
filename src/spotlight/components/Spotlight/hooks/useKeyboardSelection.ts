import { useCallback, useEffect, useState } from 'react';
import { SpotlightResult } from 'spotlight/components/Spotlight/results';

export function useKeyboardSelection(results: SpotlightResult[]) {
  const [selection, setSelection] = useState<number | null>(null);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (results.length === 0) {
        return;
      }
      const index = selection ?? -1;
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelection(index <= 0 ? null : index - 1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelection(Math.min(index + 1, results.length - 1));
          break;
      }
    },
    [results, selection],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  return {
    selectedResult: selection === null ? null : results[selection],
  };
}
