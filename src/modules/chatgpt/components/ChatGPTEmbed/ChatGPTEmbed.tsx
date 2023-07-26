import { Box, Typography } from '@mui/material';
function ChatGPTEmbed() {
  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Work in progress
      </Typography>
      <Box
        component="img"
        src="https://media2.giphy.com/media/H1dxi6xdh4NGQCZSvz/giphy.gif?cid=ecf05e474wglf1iyx4m13aqrlzgz32gt5cc6j1q1r9iy0ulc&ep=v1_gifs_search&rid=giphy.gif&ct=g"
        alt="Working"
        sx={{ width: 300 }}
      ></Box>
    </Box>
  );
}

export default ChatGPTEmbed;
