import { useCallback, useEffect } from 'react';

export function useSpotlightShortcuts({
  open,
  close,
}: {
  open: () => void;
  close: () => void;
}) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.altKey) && event.key === 'p') {
        event.preventDefault();
        open();
      }
      if (event.key === 'Escape') {
        close();
      }
    },
    [open, close],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);
}
