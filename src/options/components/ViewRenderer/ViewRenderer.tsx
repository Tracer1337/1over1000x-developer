import { createElement } from 'react';
import { Typography } from '@mui/material';
import { Redirect } from 'wouter';
import views from 'options/views';
import { useHashLocation } from 'shared/dom';

export function ViewRenderer() {
  const [location] = useHashLocation();

  const view = views.find((view) => view.path === location);

  if (!view) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {view.title}
      </Typography>
      {createElement(view.component)}
    </>
  );
}
