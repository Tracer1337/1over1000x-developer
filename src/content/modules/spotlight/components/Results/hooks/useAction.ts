import { useEffect } from 'react';

export function useAction({
  active,
  callback,
}: {
  active: boolean;
  callback: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!active || event.key !== 'Enter') {
        return;
      }
      callback();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callback]);

  return callback;
}
