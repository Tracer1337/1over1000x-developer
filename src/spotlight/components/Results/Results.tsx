import { Box, Collapse, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { useResults } from './hooks/useResults';
import { useResultAction } from './hooks/useResultAction';
import { useResultFocus } from './hooks/useResultFocus';

export function Results() {
  const focusedResultId = useResultFocus();

  const results = useResults();

  useResultAction({ results });

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
          sx={{ width: '100%' }}
          {...result.wrapperProps}
        >
          <Box
            sx={(theme) => ({
              outline:
                result.id === focusedResultId
                  ? `2px solid ${theme.palette.primary.main}`
                  : null,
              borderRadius: `${theme.shape.borderRadius}px`,
              textDecoration: 'none',
            })}
          >
            {result.node}
          </Box>
        </Collapse>
      ))}
    </Stack>
  );
}
