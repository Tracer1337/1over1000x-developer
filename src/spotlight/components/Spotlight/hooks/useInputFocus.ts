import { RefObject, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';

export function useInputFocus({
  inputRef,
  focus,
}: {
  inputRef: RefObject<HTMLElement>;
  focus: BehaviorSubject<Element | null>;
}) {
  useEffect(() => {
    const subscription = focus.subscribe((focus) => {
      const input = inputRef.current?.querySelector('input');
      if (!focus) {
        input?.focus();
      } else {
        input?.blur();
      }
    });
    return () => subscription.unsubscribe();
  }, [focus]);
}
