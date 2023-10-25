import { useRef } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { match } from 'ts-pattern';
import { Settings } from 'shared/storage';
import { SpotlightResult } from '../../results';
import GitlabIssueResult from './components/GitlabIssueResult';
import CommandResult from './components/CommandResult';
import FormResult from './components/FormResult';

export function Results({
  settings,
  results,
  selectedResult,
  onClose,
}: {
  settings: Settings;
  results: SpotlightResult[];
  selectedResult: SpotlightResult | null;
  onClose: () => void;
}) {
  const containerRef = useRef(null);

  const getResultProps = <T extends SpotlightResult['type']>(
    result: Extract<SpotlightResult, { type: T }>,
  ) => ({
    settings,
    result,
    selected: result === selectedResult,
    onClose,
  });

  return (
    <Stack gap={1} ref={containerRef} component={TransitionGroup}>
      {results.map((result) => (
        <Collapse key={result.id} timeout={100}>
          <Box
            sx={(theme) => ({
              outline:
                result === selectedResult
                  ? `2px solid ${theme.palette.primary.main}`
                  : null,
              borderRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            {match(result)
              .with({ type: 'command' }, (result) => (
                <CommandResult {...getResultProps(result)} />
              ))
              .with({ type: 'gitlab-issue' }, (result) => (
                <GitlabIssueResult {...getResultProps(result)} />
              ))
              .with({ type: 'form' }, (result) => (
                <FormResult {...getResultProps(result)} />
              ))
              .exhaustive()}
          </Box>
        </Collapse>
      ))}
    </Stack>
  );
}
