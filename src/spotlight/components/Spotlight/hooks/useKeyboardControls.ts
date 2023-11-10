import { useEffect, useMemo } from 'react';
import { BehaviorSubject } from 'rxjs';

export function useKeyboardControls() {
  const focus = useMemo(() => new BehaviorSubject<Element | null>(null), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const elements = Array.from(
        document.querySelectorAll('[data-focusable]'),
      );

      const index = focus.value ? elements.indexOf(focus.value) : -1;
      let nextIndex = index;

      if (event.key === 'ArrowDown') {
        nextIndex = Math.min(index + 1, elements.length - 1);
      }

      if (event.key === 'ArrowUp') {
        nextIndex = index - 1;
      }

      focus.next(elements[nextIndex] ?? null);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return focus;
}
