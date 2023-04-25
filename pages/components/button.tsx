import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';

import { StyledButton } from '@/components/atoms';
import { ArrowRightAlt, Close, MoveToInbox } from '@mui/icons-material';

const ButtonComponent: FC = () => {
  const router = useRouter();

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
            <StyledButton color="primary" variant="contained">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="info" variant="contained">
              Cancel
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="secondary" variant="contained">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="contained">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="contained">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="contained">
              Error
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              sx={{
                bgcolor: '#fff',
                color: 'primary.main',
                boxShadow: '0px 10px 20px rgba(17, 52, 227, 0.1)',
                '&:hover': {
                  bgcolor: '#fff',
                },
              }}
              variant="contained"
            >
              white
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="contained">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="contained">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="contained">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="contained"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="contained"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Outlined Button
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
            <StyledButton color="primary" variant="outlined">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="info" variant="outlined">
              Cancel
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="secondary" variant="outlined">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="outlined">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="outlined">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="outlined">
              Error
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="outlined">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="outlined">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="outlined">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="outlined"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="outlined"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>

        <Typography sx={{ mb: 5, mt: 10 }} variant="h5">
          Text Button
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
            <StyledButton color="primary" variant="text">
              Primary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="info" isIconButton={true}>
              <Close />
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="info" variant="text">
              Cancel
            </StyledButton>
          </Grid>

          <Grid item xs={false}>
            <StyledButton color="secondary" variant="text">
              Secondary
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="success" variant="text">
              Success
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="warning" variant="text">
              Warning
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="error" variant="text">
              Error
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              States
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="text">
              Enabled
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" variant="text">
              Hover
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton color="primary" disabled variant="text">
              Disabled
            </StyledButton>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={1}>
            <Box
              sx={{
                fontSize: 12,
                color: '#919EAB',
                lineHeight: '48px',
                height: 48,
              }}
            >
              icon
            </Box>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              startIcon={<MoveToInbox />}
              variant="text"
            >
              Export
            </StyledButton>
          </Grid>
          <Grid item xs={false}>
            <StyledButton
              color="primary"
              endIcon={<ArrowRightAlt />}
              variant="text"
            >
              Get started
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ButtonComponent;
