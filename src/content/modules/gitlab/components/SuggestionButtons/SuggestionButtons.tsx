import { IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSuggestionHelperStore } from 'content/modules/gitlab/store';

function SuggestionButtons({ row }: { row: Element }) {
  const { from, setFrom, setTo } = useSuggestionHelperStore();

  return (
    <>
      {!from ? (
        <IconButton size="small" onClick={() => setFrom(row)} sx={{ my: -1 }}>
          <ChevronRightIcon
            fontSize="inherit"
            sx={{ transform: 'rotate(90deg)' }}
          />
        </IconButton>
      ) : (
        <IconButton size="small" onClick={() => setTo(row)} sx={{ my: -1 }}>
          <ChevronRightIcon
            fontSize="inherit"
            sx={{ transform: 'rotate(-90deg)' }}
          />
        </IconButton>
      )}
    </>
  );
}

export default SuggestionButtons;
