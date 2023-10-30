import { useCallback, useEffect } from 'react';

export function useSpotlightShortcuts({ close }: { close: () => void }) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    },
    [close],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);
}
