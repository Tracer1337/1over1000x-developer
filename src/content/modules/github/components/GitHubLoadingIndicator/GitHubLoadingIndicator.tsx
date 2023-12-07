import { Box, SxProps } from '@mui/material';
import { mergeSxProps } from 'shared/dom';

export function GitHubLoadingIndicator({
  variant,
  sx,
}: {
  variant: 'spinner' | 'octocat';
  sx?: SxProps;
}) {
  if (variant === 'spinner') {
    return (
      <Box
        component="svg"
        height="64px"
        width="64px"
        viewBox="0 0 16 16"
        fill="none"
        sx={mergeSxProps(sx, {
          animation:
            '1s linear 0s infinite normal none running rotate-keyframes',
          mx: 'auto',
          mb: 4,
          display: 'block',
        })}
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

  return (
    <Box sx={mergeSxProps(sx, { textAlign: 'center' })}>
      <Box
        component="img"
        src="https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif"
        alt="Loading your activity..."
        sx={{ width: 48 }}
      />
      <Box component="p" className="color-fg-muted" sx={{ my: 1 }}>
        One moment please...
      </Box>
    </Box>
  );
}
