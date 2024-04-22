import { useMemo, useRef, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { useSettings } from 'shared/settings';
import { Subject } from 'rxjs';
import { useSpotlightShortcuts } from './hooks/useSpotlightShortcuts';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useInputFocus } from './hooks/useInputFocus';
import { SpotlightProvider } from './context';
import Results from '../Results';
import { GitLabApiContextProvider } from 'shared/gitlab';

export function Spotlight({ onClose }: { onClose: () => void }) {
  const [settings] = useSettings();

  const inputRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');

  const action = useMemo(() => new Subject<string>(), []);

  useSpotlightShortcuts({
    close: onClose,
  });

  const focus = useKeyboardControls();

  useInputFocus({ inputRef, focus });

  if (!settings) {
    return null;
  }

  return (
    <GitLabApiContextProvider>
      <SpotlightProvider value={{ input, settings, onClose, focus, action }}>
        <Stack gap={2}>
          <TextField
            placeholder="Quick actions (append > for commands)"
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            sx={{ background: 'white' }}
            fullWidth
            autoComplete="off"
            ref={inputRef}
          />
          <Results />
        </Stack>
      </SpotlightProvider>
    </GitLabApiContextProvider>
  );
}
