import { FC } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';

import { DashboardTaskKey } from '@/types';

export const Tasks: FC = observer(() => {
  const breakpoints = useBreakpoints();
  const router = useRouter();

  const {
    dashboardInfo: { taskMap, fetchTaskMap },
  } = useMst();

  const { loading } = useAsync(async () => {
    if (!router.query.loanId) {
      return;
    }
    await fetchTaskMap(router.query.loanId as string);
  }, [router.query]);

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

        {(taskMap.has(DashboardTaskKey.payoff_amount) ||
          taskMap.has(DashboardTaskKey.rehab_info) ||
          taskMap.has(DashboardTaskKey.entitlements) ||
          taskMap.has(DashboardTaskKey.permits_obtained) ||
          taskMap.has(DashboardTaskKey.square_footage)) && (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            p={{ xs: '16px 16px 8px 16px', lg: '24px 24px 12px 24px' }}
            width={'100%'}
          >
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 16, lg: 18 }}
              mb={{ xs: 1, lg: 1.5 }}
              variant={'h7'}
            >
              Loan information
            </Typography>

            {taskMap.has(DashboardTaskKey.payoff_amount) && (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks/payoff-amount',
                    query: {
                      loanId: POSGetParamsFromUrl(location.href).loanId,
                    },
                  })
                }
                px={{ xs: 2, lg: 3 }}
                py={{ xs: 1, lg: 1.5 }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: 'info.darker',
                  },
                }}
                width={'100%'}
              >
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  Payoff amount
                </Typography>
                {taskMap.get(DashboardTaskKey.payoff_amount) && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {taskMap.has(DashboardTaskKey.rehab_info) && (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks/rehab-info',
                    query: {
                      loanId: POSGetParamsFromUrl(location.href).loanId,
                    },
                  })
                }
                px={{ xs: 2, lg: 3 }}
                py={{ xs: 1, lg: 1.5 }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: 'info.darker',
                  },
                }}
                width={'100%'}
              >
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  Rehab info
                </Typography>
                {taskMap.get(DashboardTaskKey.rehab_info) && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {taskMap.has(DashboardTaskKey.square_footage) && (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks/square-footage',
                    query: {
                      loanId: POSGetParamsFromUrl(location.href).loanId,
                    },
                  })
                }
                px={{ xs: 2, lg: 3 }}
                py={{ xs: 1, lg: 1.5 }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: 'info.darker',
                  },
                }}
                width={'100%'}
              >
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  Square footage
                </Typography>
                {taskMap.get(DashboardTaskKey.square_footage) && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {taskMap.has(DashboardTaskKey.entitlements) && (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks/entitlements',
                    query: {
                      loanId: POSGetParamsFromUrl(location.href).loanId,
                    },
                  })
                }
                px={{ xs: 2, lg: 3 }}
                py={{ xs: 1, lg: 1.5 }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: 'info.darker',
                  },
                }}
                width={'100%'}
              >
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  Entitlements
                </Typography>
                {taskMap.get(DashboardTaskKey.entitlements) && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {taskMap.has(DashboardTaskKey.permits_obtained) && (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks/permits-obtained',
                    query: {
                      loanId: POSGetParamsFromUrl(location.href).loanId,
                    },
                  })
                }
                px={{ xs: 2, lg: 3 }}
                py={{ xs: 1, lg: 1.5 }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: 'info.darker',
                  },
                }}
                width={'100%'}
              >
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  Permits obtained
                </Typography>
                {taskMap.get(DashboardTaskKey.permits_obtained) && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}
          </Stack>
        )}

        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          p={{ xs: '16px 16px 8px 16px', lg: '24px 24px 12px 24px' }}
          width={'100%'}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 16, lg: 18 }}
            mb={{ xs: 1, lg: 1.5 }}
            variant={'h7'}
          >
            Borrower information
          </Typography>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() =>
              router.push({
                pathname: '/dashboard/tasks/borrower',
                query: { loanId: POSGetParamsFromUrl(location.href).loanId },
              })
            }
            px={{ xs: 2, lg: 3 }}
            py={{ xs: 1, lg: 1.5 }}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography fontSize={{ xs: 12, lg: 16 }}>Borrower</Typography>
            {taskMap.get(DashboardTaskKey.borrower) && (
              <CheckCircle color={'success'} />
            )}
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() =>
              router.push({
                pathname: '/dashboard/tasks/co-borrower',
                query: { loanId: POSGetParamsFromUrl(location.href).loanId },
              })
            }
            px={{ xs: 2, lg: 3 }}
            py={{ xs: 1, lg: 1.5 }}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography fontSize={{ xs: 12, lg: 16 }}>Co-borrower</Typography>
            {taskMap.get(DashboardTaskKey.co_borrower) && (
              <CheckCircle color={'success'} />
            )}
          </Stack>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() =>
              router.push({
                pathname: '/dashboard/tasks/demographics-information',
                query: { loanId: POSGetParamsFromUrl(location.href).loanId },
              })
            }
            px={{ xs: 2, lg: 3 }}
            py={{ xs: 1, lg: 1.5 }}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography fontSize={{ xs: 12, lg: 16 }}>
              Demographic information
            </Typography>
            {taskMap.get(DashboardTaskKey.demographics) && (
              <CheckCircle color={'success'} />
            )}
          </Stack>
        </Stack>

        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          p={{ xs: '16px 16px 8px 16px', lg: '24px 24px 12px 24px' }}
          width={'100%'}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 16, lg: 18 }}
            mb={{ xs: 1, lg: 1.5 }}
            variant={'h7'}
          >
            Third-party information
          </Typography>

          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() =>
              router.push({
                pathname: '/dashboard/tasks/title-or-escrow-company',
                query: { loanId: POSGetParamsFromUrl(location.href).loanId },
              })
            }
            px={{ xs: 2, lg: 3 }}
            py={{ xs: 1, lg: 1.5 }}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                borderRadius: 1,
                bgcolor: 'info.darker',
              },
            }}
            width={'100%'}
          >
            <Typography fontSize={{ xs: 12, lg: 16 }}>
              Title / Escrow company (optional)
            </Typography>
            {taskMap.get(DashboardTaskKey.title_escrow) && (
              <CheckCircle color={'success'} />
            )}
          </Stack>
        </Stack>

        {taskMap.has(DashboardTaskKey.holdback_process) && (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            p={{ xs: '16px 16px 8px 16px', lg: '24px 24px 12px 24px' }}
            width={'100%'}
          >
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 16, lg: 18 }}
              mb={{ xs: 1, lg: 1.5 }}
              variant={'h7'}
            >
              Agreements
            </Typography>

            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() =>
                router.push({
                  pathname: '/dashboard/tasks/construction-holdback-process',
                  query: {
                    loanId: POSGetParamsFromUrl(location.href).loanId,
                  },
                })
              }
              px={{ xs: 2, lg: 3 }}
              py={{ xs: 1, lg: 1.5 }}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: 'info.darker',
                },
              }}
              width={'100%'}
            >
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                Construction holdback process
              </Typography>
              {taskMap.get(DashboardTaskKey.holdback_process) && (
                <CheckCircle color={'success'} />
              )}
            </Stack>
          </Stack>
        )}

        {taskMap.has(DashboardTaskKey.referring_broker) && (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            p={{ xs: '16px 16px 8px 16px', lg: '24px 24px 12px 24px' }}
            width={'100%'}
          >
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 16, lg: 18 }}
              mb={{ xs: 1, lg: 1.5 }}
              variant={'h7'}
            >
              Broker
            </Typography>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() =>
                router.push({
                  pathname: '/dashboard/tasks/referring-broker',
                  query: { loanId: POSGetParamsFromUrl(location.href).loanId },
                })
              }
              px={{ xs: 2, lg: 3 }}
              py={{ xs: 1, lg: 1.5 }}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: 'info.darker',
                },
              }}
              width={'100%'}
            >
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                Referring broker
              </Typography>
              {taskMap.get(DashboardTaskKey.referring_broker) && (
                <CheckCircle color={'success'} />
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Fade>
  );
});
