import { useCallback, useEffect } from 'react';

export function useSpotlightShortcuts(setIsOpen: (isOpen: boolean) => void) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [setIsOpen]);
}
