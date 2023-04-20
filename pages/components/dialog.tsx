import { FC } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
} from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';
import { useSwitch } from '@/hooks';
import { POSFont } from '@/styles';
import { DeleteForever } from '@mui/icons-material';

const DialogComponent: FC = () => {
  const router = useRouter();

  const { visible: show, open, close } = useSwitch(false);
  const { visible: show1, open: open1, close: close1 } = useSwitch(false);

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
        <Typography variant={'h4'}>iconDialog</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <StyledButton color="primary" onClick={open} variant="contained">
              Open Icon Dialog
            </StyledButton>
            <StyledDialog
              customHeader={
                <>
                  <DeleteForever
                    sx={{
                      mr: 1.5,
                      lineHeight: '28px',
                      verticalAlign: 'middle',
                    }}
                  />
                  Delete Files?
                </>
              }
              customContent={
                <Box sx={{ ...POSFont(14, 400, 1.5, 'info.main') }}>
                  Are you sure you want to delete Property Address
                </Box>
              }
              customFooter={
                <>
                  <StyledButton
                    color="error"
                    onClick={close}
                    size="small"
                    variant="contained"
                  >
                    Delete
                  </StyledButton>
                  <StyledButton
                    autoFocus
                    color="info"
                    onClick={close}
                    size="small"
                    sx={{ ml: 3 }}
                    variant="outlined"
                  >
                    Cancel
                  </StyledButton>
                </>
              }
              fullWidth={true}
              onClose={close}
              open={show}
            />
          </Box>

          <Box>
            <StyledButton color="primary" onClick={open1} variant="contained">
              Open Dialog
            </StyledButton>
            <StyledDialog
              customContent={
                <Box sx={{ ...POSFont(14, 400, 1.5, 'info.main') }}>
                  Sign out of current account?
                </Box>
              }
              customFooter={
                <>
                  <StyledButton
                    autoFocus
                    color="info"
                    onClick={close1}
                    size="small"
                    variant="outlined"
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    color="primary"
                    onClick={close1}
                    size="small"
                    sx={{ ml: 3 }}
                    variant="contained"
                  >
                    Confirm
                  </StyledButton>
                </>
              }
              customHeader="Sign out"
              fullWidth={true}
              onClose={close1}
              open={show1}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default DialogComponent;
