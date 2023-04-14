import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Grid, Typography } from '@mui/material';

import { StyledButton, StyledTooltip } from '@/components/atoms';

const TooltipComponent: FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        m: 4,
        p: 4,
        width: '50%',
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
            <Grid item>
              <StyledTooltip open={true} placement="top-start" title="Add">
                <StyledButton>top-start</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="top" title="Add">
                <StyledButton>top</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="top-end" title="Add">
                <StyledButton>top-end</StyledButton>
              </StyledTooltip>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <StyledTooltip placement="left-start" title="Add">
                <StyledButton>left-start</StyledButton>
              </StyledTooltip>
              <br />
              <StyledTooltip placement="left" title="Add">
                <StyledButton>left</StyledButton>
              </StyledTooltip>
              <br />
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
                  <StyledButton>right</StyledButton>
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
            <Grid item>
              <StyledTooltip placement="bottom-start" title="Add">
                <StyledButton>bottom-start</StyledButton>
              </StyledTooltip>
              <StyledTooltip placement="bottom" title="Add">
                <StyledButton>bottom</StyledButton>
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
