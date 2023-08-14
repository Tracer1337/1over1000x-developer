import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCache } from './hooks/useCache';

export function Cache() {
  const { content, clearCache } = useCache();

  return (
    <Accordion sx={{ '&::before': { display: 'none' } }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Cache</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper sx={{ overflow: 'auto', p: 1, mb: 2 }} variant="outlined">
          <Box component="pre">{content}</Box>
        </Paper>
        <Button color="error" onClick={clearCache} variant="contained">
          Clear
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
