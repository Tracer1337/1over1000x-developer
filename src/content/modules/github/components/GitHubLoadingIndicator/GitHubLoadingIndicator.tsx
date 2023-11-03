import { Box } from '@mui/material';

export function GitHubLoadingIndicator() {
  return (
    <Box
      component="svg"
      height="64px"
      width="64px"
      viewBox="0 0 16 16"
      fill="none"
      sx={{
        animation: '1s linear 0s infinite normal none running rotate-keyframes',
        mx: 'auto',
        mb: 4,
        display: 'block',
      }}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      ></circle>
      <path
        d="M15 8a7.002 7.002 0 00-7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      ></path>
    </Box>
  );
}
