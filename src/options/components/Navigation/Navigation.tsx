import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { useHashLocation } from 'shared/dom';
import views from 'options/views';

export function Navigation() {
  const [location, setLocation] = useHashLocation();

  return (
    <Stack gap={1}>
      {views.map(({ path, title, icon }, index) => (
        <Card key={index} variant="outlined" sx={{ width: 300 }}>
          <CardActionArea onClick={() => setLocation(path)}>
            <CardContent
              sx={(theme) => ({
                color:
                  location === path ? theme.palette.primary.main : 'initial',
                display: 'flex',
              })}
            >
              <Box sx={{ mr: 2 }}>{React.createElement(icon)}</Box>
              <Typography>{title}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
