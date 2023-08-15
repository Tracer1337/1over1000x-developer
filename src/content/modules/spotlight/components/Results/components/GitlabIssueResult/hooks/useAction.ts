import { useEffect, useCallback } from 'react';

export function useAction({
  active,
  href,
  callback,
}: {
  active: boolean;
  href: string;
  callback: () => void;
}) {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!active || event.key !== 'Enter') {
        return;
      }
      window.open(href, '_blank');
      callback();
    },
    [active, href],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);
}
