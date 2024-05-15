import { Box, Typography, styled } from '@mui/material';
import { useElementMeasurements } from '../ElementDesigner/hooks/useElementMeasurements';
import React from 'react';

const Area = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.5),
  position: 'relative',
  border: '1px dotted black',
}));

const Row = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.5),
  left: theme.spacing(0.5),
  fontSize: 10,
}));

function Value({ children }: React.PropsWithChildren<{}>) {
  return (
    <Typography sx={{ fontSize: 10 }}>
      {children === 0 ? '-' : children}
    </Typography>
  );
}

export function ElementDesignerMeasurementsGraphic() {
  const measurements = useElementMeasurements();

  if (!measurements) {
    return;
  }

  return (
    <Area
      sx={{
        backgroundColor: '#f3cca2',
      }}
    >
      <Label>margin</Label>

      <Row>
        <Value>{measurements.marginTop}</Value>
      </Row>

      <Row>
        <Value>{measurements.marginLeft}</Value>

        <Area
          sx={{
            backgroundColor: '#fcecbf',
          }}
        >
          <Label>border</Label>

          <Row>
            <Value>{measurements.borderTopWidth}</Value>
          </Row>

          <Row>
            <Value>{measurements.borderLeftWidth}</Value>

            <Area
              sx={{
                backgroundColor: '#c7dab8',
              }}
            >
              <Label>padding</Label>

              <Row>
                <Value>{measurements.paddingTop}</Value>
              </Row>

              <Row>
                <Value>{measurements.paddingLeft}</Value>

                <Area sx={{ backgroundColor: '#a3c3e3', minWidth: 100 }}>
                  <Row>
                    <Value>
                      {`${measurements.width}x${measurements.height}`}
                    </Value>
                  </Row>
                </Area>

                <Value>{measurements.paddingRight}</Value>
              </Row>

              <Row>
                <Value>{measurements.paddingBottom}</Value>
              </Row>
            </Area>

            <Value>{measurements.borderRightWidth}</Value>
          </Row>

          <Row>
            <Value>{measurements.borderBottomWidth}</Value>
          </Row>
        </Area>

        <Value>{measurements.marginRight}</Value>
      </Row>

      <Row>
        <Value>{measurements.marginBottom}</Value>
      </Row>
    </Area>
  );
}
