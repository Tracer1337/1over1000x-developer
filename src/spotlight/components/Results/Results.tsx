import { Box, Collapse, Stack } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { useResults } from './hooks/useResults';

export function Results() {
  const results = useResults();

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
