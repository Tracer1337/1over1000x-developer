import { useEffect, useRef, useState } from 'react';
import { useSpotlightShortcuts } from './hooks/useSpotlightShortcuts';
import { Box, Stack, TextField } from '@mui/material';
import { SpotlightResult, generateResults } from '../../results';
import Results from '../Results';
import { useKeyboardSelection } from './hooks/useKeyboardSelection';

export function Spotlight() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<SpotlightResult[]>([]);

  const { selectedResult, resetSelection } = useKeyboardSelection(results);

  const handleClose = () => {
    setIsOpen(false);
    resetSelection();
  };

  useSpotlightShortcuts({
    open: () => setIsOpen(true),
    close: handleClose,
  });

  useEffect(() => setResults(generateResults(input)), [input]);

  useEffect(() => {
    if (!isOpen) {
      setInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedResult === null) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [selectedResult]);

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack gap={1} sx={{ mt: '20vh', width: 600, maxWidth: '80vw' }}>
        <TextField
          placeholder="Quick Actions"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          sx={{ background: 'white' }}
          fullWidth
          autoFocus
          autoComplete="off"
          inputRef={inputRef}
        />
        <Results
          results={results}
          selectedResult={selectedResult}
          onClose={handleClose}
        />
      </Stack>
    </Box>
  );
}
