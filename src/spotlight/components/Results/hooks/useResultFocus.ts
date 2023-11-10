import { useEffect, useState } from 'react';
import { useSpotlight } from 'spotlight/components/Spotlight/context';

export function useResultFocus() {
  const { focus } = useSpotlight();

  const [focusedResultId, setFocusedResultId] = useState<string | null>(null);

  useEffect(() => {
    const subscription = focus.subscribe((element) =>
      setFocusedResultId(element?.getAttribute('data-result-id') ?? null),
    );
    return () => subscription.unsubscribe();
  }, [focus]);

  return focusedResultId;
}
