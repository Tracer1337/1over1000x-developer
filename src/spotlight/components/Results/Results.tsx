import { createElement } from 'react';
import { Box, Collapse, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { Settings } from 'shared/storage';
import { SpotlightResult } from '../Spotlight/results';
import { resultComponents } from './components';

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
  return (
    <Stack
      gap={1}
      flexDirection="row"
      flexWrap="wrap"
      component={TransitionGroup}
    >
      {results.map((result) => (
        <Collapse
          key={result.id}
          timeout={100}
          {...resultComponents[result.type].wrapperProps}
        >
          <Box
            sx={(theme) => ({
              outline:
                result === selectedResult
                  ? `2px solid ${theme.palette.primary.main}`
                  : null,
              borderRadius: `${theme.shape.borderRadius}px`,
            })}
          >
            {createElement(resultComponents[result.type] as any, {
              settings,
              result,
              selected: result === selectedResult,
              onClose,
            })}
          </Box>
        </Collapse>
      ))}
    </Stack>
  );
}
