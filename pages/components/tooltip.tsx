import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Grid, Typography } from '@mui/material';

import { StyledButton, StyledTooltip } from '@/components/atoms';

const TooltipComponent: FC = () => {
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
        <Typography variant={'h4'}>Tooltip</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Grid container justifyContent="center">
            <Grid container item justifyContent="center">
              <StyledTooltip
                open={true}
                placement="top-start"
                theme="dark"
                title="Add"
              >
                <StyledButton>dark top-start</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="top" theme="dark" title="Add">
                <StyledButton sx={{ mx: 3 }}>dark top</StyledButton>
              </StyledTooltip>
              <StyledTooltip
                placement="top-end"
                theme="dark"
                title="dark top-enddark top-enddark top-enddark top-enddark top-enddark top-enddark top-enddark top-end"
              >
                <StyledButton>dark top-end</StyledButton>
              </StyledTooltip>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <StyledTooltip placement="left-start" title="Add">
                <StyledButton>left-start</StyledButton>
              </StyledTooltip>

              <StyledTooltip placement="left" title="Add">
                <StyledButton sx={{ my: 3 }}>left</StyledButton>
              </StyledTooltip>

              <StyledTooltip placement="left-end" title="Add">
                <StyledButton>left-end</StyledButton>
              </StyledTooltip>
            </Grid>
            <Grid
              alignItems="flex-end"
              container
              direction="column"
              item
              xs={6}
            >
              <Grid item>
                <StyledTooltip placement="right-start" title="Add">
                  <StyledButton>right-start</StyledButton>
                </StyledTooltip>
              </Grid>
              <Grid item>
                <StyledTooltip placement="right" title="Add">
                  <StyledButton sx={{ my: 3 }}>right</StyledButton>
                </StyledTooltip>
              </Grid>
              <Grid item>
                <StyledTooltip placement="right-end" title="Add">
                  <StyledButton>right-end</StyledButton>
                </StyledTooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid container item justifyContent="center">
              <StyledTooltip placement="bottom-start" title="Add">
                <StyledButton>bottom-start</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="bottom" title="Add">
                <StyledButton sx={{ mx: 3 }}>bottom</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="bottom-end" title="Add">
                <StyledButton>bottom-end</StyledButton>
              </StyledTooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
export default TooltipComponent;
