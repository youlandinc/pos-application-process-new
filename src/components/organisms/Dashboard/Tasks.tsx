import { FC } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAsync } from 'react-use';

import { POSGetParamsFromUrl } from '@/utils';
import { useBreakpoints } from '@/hooks';

import { _fetchLoanTaskList } from '@/requests/dashboard';

import { StyledLoading } from '@/components/atoms';

export const Tasks: FC = () => {
  const breakpoints = useBreakpoints();

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    const { data } = await _fetchLoanTaskList(loanId);
    console.log(data);
  });

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Your tasks checklist
        </Typography>

        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          p={'24px 24px 12px 24px'}
          width={'100%'}
        >
          <Typography color={'text.primary'} mb={1.5} variant={'h7'}>
            Borrower information
          </Typography>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Borrower</Typography>

            <CheckCircle color={'success'} />
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Co-borrower</Typography>
            <CheckCircle color={'success'} />
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Real estate investment experience</Typography>
            <CheckCircle color={'success'} />
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Demographics information</Typography>
            <CheckCircle color={'success'} />
          </Stack>
        </Stack>

        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          p={'24px 24px 12px 24px'}
          width={'100%'}
        >
          <Typography color={'text.primary'} mb={1.5} variant={'h7'}>
            Third-party information
          </Typography>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Title / Escrow company (optional)</Typography>
            <CheckCircle color={'success'} />
          </Stack>
        </Stack>

        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          p={'24px 24px 12px 24px'}
          width={'100%'}
        >
          <Typography color={'text.primary'} mb={1.5} variant={'h7'}>
            Agreements
          </Typography>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            px={3}
            py={1.5}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography>Construction holdback process</Typography>
            <CheckCircle color={'success'} />
          </Stack>
        </Stack>
      </Stack>
    </Fade>
  );
};
