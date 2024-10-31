import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { useBreakpoints } from '@/hooks';

import { POSGetParamsFromUrl, POSNotUndefined } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

import { StyledLoading } from '@/components/atoms';

import { DashboardTaskKey, DashboardTasksResponse, HttpError } from '@/types';
import { _fetchLoanTaskList } from '@/requests/dashboard';

export const Tasks: FC = () => {
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [taskHash, setTaskHash] = useState<DashboardTasksResponse>();

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const { data } = await _fetchLoanTaskList(loanId);
      setTaskHash(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [location.href]);

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

        {(POSNotUndefined(taskHash?.[DashboardTaskKey.payoff_amount]) ||
          POSNotUndefined(taskHash?.[DashboardTaskKey.rehab_info])) && (
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

            {POSNotUndefined(taskHash?.[DashboardTaskKey.payoff_amount]) && (
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
                {taskHash?.[DashboardTaskKey.payoff_amount] && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {POSNotUndefined(taskHash?.[DashboardTaskKey.rehab_info]) && (
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
                {taskHash?.[DashboardTaskKey.rehab_info] && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {POSNotUndefined(taskHash?.[DashboardTaskKey.entitlements]) && (
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
                {taskHash?.[DashboardTaskKey.entitlements] && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}

            {POSNotUndefined(taskHash?.[DashboardTaskKey.permits_obtained]) && (
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
                {taskHash?.[DashboardTaskKey.permits_obtained] && (
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
            {taskHash?.[DashboardTaskKey.borrower] && (
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
            {taskHash?.[DashboardTaskKey.co_borrower] && (
              <CheckCircle color={'success'} />
            )}
          </Stack>

          {/*<Stack*/}
          {/*  alignItems={'center'}*/}
          {/*  flexDirection={'row'}*/}
          {/*  justifyContent={'space-between'}*/}
          {/*  onClick={() =>*/}
          {/*    router.push({*/}
          {/*      pathname: '/dashboard/tasks/real-estate-investment-experience',*/}
          {/*      query: { loanId: POSGetParamsFromUrl(location.href).loanId },*/}
          {/*    })*/}
          {/*  }*/}
          {/*  px={{ xs: 2, lg: 3 }}*/}
          {/*  py={{ xs: 1, lg: 1.5 }}*/}
          {/*  sx={{*/}
          {/*    '&:hover': {*/}
          {/*      cursor: 'pointer',*/}
          {/*      borderRadius: 1,*/}
          {/*      bgcolor: 'info.darker',*/}
          {/*    },*/}
          {/*  }}*/}
          {/*  width={'100%'}*/}
          {/*>*/}
          {/*  <Typography fontSize={{ xs: 12, lg: 16 }}>*/}
          {/*    Real estate investment experience*/}
          {/*  </Typography>*/}
          {/*  {taskHash?.[DashboardTaskKey.real_investment] && (*/}
          {/*    <CheckCircle color={'success'} />*/}
          {/*  )}*/}
          {/*</Stack>*/}

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
            {taskHash?.[DashboardTaskKey.demographics] && (
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
            {taskHash?.[DashboardTaskKey.title_escrow] && (
              <CheckCircle color={'success'} />
            )}
          </Stack>
        </Stack>

        {POSNotUndefined(taskHash?.[DashboardTaskKey.holdback_process]) && (
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

            {POSNotUndefined(taskHash?.[DashboardTaskKey.holdback_process]) && (
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
                {taskHash?.[DashboardTaskKey.holdback_process] && (
                  <CheckCircle color={'success'} />
                )}
              </Stack>
            )}
          </Stack>
        )}

        {POSNotUndefined(taskHash?.[DashboardTaskKey.referring_broker]) && (
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
              {taskHash?.[DashboardTaskKey.referring_broker] && (
                <CheckCircle color={'success'} />
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Fade>
  );
};
