import { useEffect, useMemo, useState } from 'react';
import { useSettings } from 'shared/settings';
import { SpotlightResult, generateResults } from '../results';

export function useResults(input: string) {
  const [settings] = useSettings();

  const [results, setResults] = useState<SpotlightResult[]>([]);

  const resultsObservable = useMemo(
    () => generateResults(settings, input),
    [settings, input],
  );

  useEffect(() => {
    const subscription = resultsObservable.subscribe(setResults);
    return () => subscription.unsubscribe();
  }, [resultsObservable, setResults]);

  return results;
}
