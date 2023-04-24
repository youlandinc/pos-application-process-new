import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { useSnackbar } from 'notistack';
import { AUTO_HIDE_DURATION } from '@/constants';

const SnackbarComponent: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const onSnackbar = (
    type: 'default' | 'error' | 'success' | 'warning' | 'info',
  ) => {
    enqueueSnackbar(`This is a ${type} message!`, {
      variant: type,
      autoHideDuration: 100000 | AUTO_HIDE_DURATION,
    });
  };
  return (
    <Box
      sx={{
        p: 4,
        width: { lg: '50%', xs: '100%' },
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        '& .component_wrap': {
          '& .divider': {
            my: 2,
          },
          '& .component_item': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
            p: 4,
            borderRadius: 4,
          },
        },
      }}
    >
      <StyledButton
        onClick={() => router.back()}
        sx={{
          my: 3,
        }}
        variant={'outlined'}
      >
        back to components
      </StyledButton>
      <Box className={'component_wrap'}>
        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Contained Button
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              color
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              onClick={() => onSnackbar('default')}
              variant="contained"
            >
              Default
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="info"
              onClick={() => onSnackbar('info')}
              variant="contained"
            >
              Info
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="success"
              onClick={() => onSnackbar('success')}
              variant="contained"
            >
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="warning"
              onClick={() => onSnackbar('warning')}
              variant="contained"
            >
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="error"
              onClick={() => onSnackbar('error')}
              variant="contained"
            >
              Error
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SnackbarComponent;
