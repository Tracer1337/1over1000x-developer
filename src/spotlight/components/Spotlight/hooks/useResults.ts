import { useEffect, useMemo, useState } from 'react';
import { Subject } from 'rxjs';
import { useSettings } from 'shared/settings';
import { SpotlightResult, createResultGenerator } from '../results';

export function useResults(input: string) {
  const [settings] = useSettings();

  const [results, setResults] = useState<SpotlightResult[]>([]);

  const inputSubject = useMemo(() => new Subject<string>(), []);

  useEffect(() => inputSubject.next(input), [input]);

  const resultsObservable = useMemo(
    () => createResultGenerator(settings, inputSubject),
    [settings],
  );

  useEffect(() => {
    const subscription = resultsObservable.subscribe(setResults);
    return () => subscription.unsubscribe();
  }, [resultsObservable, setResults]);

  return results;
}
