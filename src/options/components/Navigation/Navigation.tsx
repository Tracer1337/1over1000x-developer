import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import views from 'options/views';

export function Navigation({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Stack gap={1}>
      {views.map(({ title, icon }, index) => (
        <Card key={index} variant="outlined" sx={{ width: 300 }}>
          <CardActionArea onClick={() => onChange(index)}>
            <CardContent
              sx={(theme) => ({
                color: index === value ? theme.palette.primary.main : 'initial',
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
