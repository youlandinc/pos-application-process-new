import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  StyledButton,
  StyledDialog,
  StyledPaymentCard,
} from '@/components/atoms';
import { Close } from '@mui/icons-material';
import { useSwitch } from '@/hooks';

export const PaymentLinkPreview: FC = () => {
  const { open, close, visible } = useSwitch();

  return (
    <Stack
      alignItems={'center'}
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      flexDirection={'row'}
      gap={{ xs: 2, md: 3 }}
      justifyContent={'space-between'}
      p={{ xs: 2, md: 3 }}
    >
      <Typography
        color={'text.primary'}
        component={'div'}
        fontSize={{ xs: 16, lg: 18 }}
        fontWeight={600}
      >
        Preview custom payment link
        <Typography
          color={'text.secondary'}
          component={'p'}
          fontSize={{ xs: 12, lg: 14 }}
          mt={1}
        >
          View your changes below by clicking the button to the right
        </Typography>
      </Typography>
      <StyledButton onClick={open} size={'small'}>
        Preview
      </StyledButton>

      <StyledDialog
        content={
          <Stack height={1080}>
            <StyledPaymentCard mode={'uncheck'} secret={''} />
          </Stack>
        }
        header={
          <Stack
            flexDirection={'row'}
            justifyContent={'center'}
            pb={1.5}
            position={'relative'}
          >
            <Typography color={'text.primary'} fontSize={18} fontWeight={600}>
              Preview custom payment page
            </Typography>
            <Close
              onClick={close}
              sx={{
                fontSize: 24,
                color: 'text.primary',
                flexShrink: 0,
                mt: 0.125,
                cursor: 'pointer',
                ml: 'auto',
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(calc(-50% - 6px))',
              }}
            />
          </Stack>
        }
        headerSx={{
          bgcolor: '#FBFCFD',
        }}
        open={visible}
        sx={{
          '&.MuiDialog-root': {
            '& .MuiPaper-root': {
              maxWidth: 1366,
            },
          },
        }}
      />
    </Stack>
  );
};
