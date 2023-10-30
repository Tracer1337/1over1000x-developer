import { useEffect, useRef, useState } from 'react';
import { useSpotlightShortcuts } from './hooks/useSpotlightShortcuts';
import { Stack, TextField } from '@mui/material';
import { useSettings } from 'shared/settings';
import { SpotlightResult, generateResults } from './results';
import Results from '../Results';
import { useKeyboardSelection } from './hooks/useKeyboardSelection';

export function Spotlight({ onClose }: { onClose: () => void }) {
  const [settings] = useSettings();

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);

  const { selectedResult } = useKeyboardSelection(results);

  useSpotlightShortcuts({
    close: onClose,
  });

  useEffect(() => {
    if (settings) {
      generateResults(settings, input).then(setResults);
    }
  }, [settings, input]);

  useEffect(() => {
    if (selectedResult === null) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [selectedResult]);

  if (!settings) {
    return null;
  }

  return (
    <Stack gap={2}>
      <TextField
        placeholder="Quick actions (append > for commands)"
        value={input}
        onChange={(event) => setInput(event.currentTarget.value)}
        sx={{ background: 'white' }}
        fullWidth
        autoFocus
        autoComplete="off"
        inputRef={inputRef}
      />
      <Results
        settings={settings}
        results={results}
        selectedResult={selectedResult}
        onClose={onClose}
      />
    </Stack>
  );
}
