import { useRef } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { match } from 'ts-pattern';
import { SpotlightResult } from '../../results';
import GitlabIssueResult from './components/GitlabIssueResult';

export function Results({
  results,
  selectedResult,
  onClose,
}: {
  results: SpotlightResult[];
  selectedResult: SpotlightResult | null;
  onClose: () => void;
}) {
  const containerRef = useRef(null);

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
              .with({ type: 'gitlab-issue' }, () => (
                <GitlabIssueResult
                  result={result}
                  selected={result === selectedResult}
                  onClose={onClose}
                />
              ))
              .exhaustive()}
          </Box>
        </Collapse>
      ))}
    </Stack>
  );
}
