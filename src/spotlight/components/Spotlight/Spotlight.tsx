import { useRef, useState } from 'react';
import { useSpotlightShortcuts } from './hooks/useSpotlightShortcuts';
import { Stack, TextField } from '@mui/material';
import { useSettings } from 'shared/settings';
import { SpotlightProvider } from './context';
import Results from '../Results';

export function Spotlight({ onClose }: { onClose: () => void }) {
  const [settings] = useSettings();

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState('');

  useSpotlightShortcuts({
    close: onClose,
  });

  if (!settings) {
    return null;
  }

  return (
    <SpotlightProvider value={{ input, settings, onClose }}>
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
        <Results />
      </Stack>
    </SpotlightProvider>
  );
}
