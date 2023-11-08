import { useEffect, useRef, useState } from 'react';
import { useSpotlightShortcuts } from './hooks/useSpotlightShortcuts';
import { Stack, TextField } from '@mui/material';
import { useSettings } from 'shared/settings';
import { useResults } from './hooks/useResults';
import { useKeyboardSelection } from './hooks/useKeyboardSelection';
import Results from '../Results';

export function Spotlight({ onClose }: { onClose: () => void }) {
  const [settings] = useSettings();

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');

  const results = useResults(input);

  const { selectedResult } = useKeyboardSelection(results);

  useSpotlightShortcuts({
    close: onClose,
  });

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
