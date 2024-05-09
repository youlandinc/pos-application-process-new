import { FC, useEffect, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { StyledButton, StyledLoading } from '@/components/atoms';

export const TasksTitleOrEscrow: FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
        alignItems={'center'}
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography color={'text.primary'} textAlign={'center'} variant={'h4'}>
          Title company (optional)
          <Typography color={'text.secondary'} mt={1.5} variant={'body1'}>
            A closing agent assists with closing and verifies there are no
            outstanding title issues. YouLand also orders a Title Commitment and
            a Title Report from this agent.
          </Typography>
        </Typography>

        <Stack
          flexDirection={{ xs: 'unset', md: 'row' }}
          gap={3}
          maxWidth={600}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={() => {
              router.push({
                pathname: '/dashboard/tasks',
                query: { loanId: router.query.loanId },
              });
            }}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            sx={{ flex: 1, maxWidth: 276, width: '100%' }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
