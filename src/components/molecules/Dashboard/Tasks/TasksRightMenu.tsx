import { FC, useState } from 'react';
import { Collapse, Icon, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { POSGetParamsFromUrl, POSNotUndefined } from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

import { DashboardTaskKey, DashboardTasksResponse, HttpError } from '@/types';
import { _fetchLoanTaskList } from '@/requests/dashboard';

import TASKS_ARROW from '@/svg/dashboard/tasks_arrow.svg';

export const TasksRightMenu: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [taskHash, setTaskHash] = useState<DashboardTasksResponse>();

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);

  useAsync(async () => {
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

  return (
    <Stack flexShrink={0} gap={1} pr={1.5} py={1.5} width={240}>
      <Typography pl={0.75} variant={'subtitle2'}>
        Tasks
      </Typography>

      {(POSNotUndefined(taskHash?.[DashboardTaskKey.payoff_amount]) ||
        POSNotUndefined(taskHash?.[DashboardTaskKey.rehab_info]) ||
        POSNotUndefined(taskHash?.[DashboardTaskKey.entitlements]) ||
        POSNotUndefined(taskHash?.[DashboardTaskKey.permits_obtained]) ||
        POSNotUndefined(taskHash?.[DashboardTaskKey.square_footage])) && (
        <Stack borderBottom={'1px solid #D2D6E1'} pb={1}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            onClick={() => setOpen1(!open1)}
            px={0.75}
            sx={{ cursor: 'pointer' }}
          >
            <Typography color={'text.secondary'} variant={'subtitle3'}>
              Loan information
            </Typography>
            <Icon
              component={TASKS_ARROW}
              sx={{
                width: 14,
                height: 14,
                ml: 'auto',
                transform: `rotate(${open1 ? '0' : '-.25'}turn)`,
                transition: 'all .3s',
              }}
            />
          </Stack>

          <Collapse in={open1}>
            <Stack gap={1} mt={0.5} width={'100%'}>
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
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>Payoff amount</Typography>
                  {taskHash?.[DashboardTaskKey.payoff_amount] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
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
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>Rehab info</Typography>
                  {taskHash?.[DashboardTaskKey.rehab_info] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              )}

              {POSNotUndefined(taskHash?.[DashboardTaskKey.square_footage]) && (
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
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>Square footage</Typography>
                  {taskHash?.[DashboardTaskKey.square_footage] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
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
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>Entitlements</Typography>
                  {taskHash?.[DashboardTaskKey.entitlements] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              )}

              {POSNotUndefined(
                taskHash?.[DashboardTaskKey.permits_obtained],
              ) && (
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
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>Permits obtained</Typography>
                  {taskHash?.[DashboardTaskKey.permits_obtained] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              )}
            </Stack>
          </Collapse>
        </Stack>
      )}

      <Stack borderBottom={'1px solid #D2D6E1'} pb={1}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          onClick={() => setOpen2(!open2)}
          px={0.75}
          sx={{ cursor: 'pointer' }}
        >
          <Typography color={'text.secondary'} variant={'subtitle3'}>
            Borrower information
          </Typography>
          <Icon
            component={TASKS_ARROW}
            sx={{
              width: 14,
              height: 14,
              ml: 'auto',
              transform: `rotate(${open2 ? '0' : '-.25'}turn)`,
              transition: 'all .3s',
            }}
          />
        </Stack>

        <Collapse in={open2}>
          <Stack gap={1} mt={0.5} width={'100%'}>
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
              px={0.75}
              py={0.5}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: '#F0F4FF',
                },
              }}
              width={'100%'}
            >
              <Typography variant={'body3'}>Borrower</Typography>
              {taskHash?.[DashboardTaskKey.borrower] && (
                <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
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
              px={0.75}
              py={0.5}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: '#F0F4FF',
                },
              }}
              width={'100%'}
            >
              <Typography variant={'body3'}>Co-borrower</Typography>
              {taskHash?.[DashboardTaskKey.co_borrower] && (
                <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
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
              px={0.75}
              py={0.5}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: '#F0F4FF',
                },
              }}
              width={'100%'}
            >
              <Typography variant={'body3'}>Demographic information</Typography>
              {taskHash?.[DashboardTaskKey.demographics] && (
                <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
              )}
            </Stack>
          </Stack>
        </Collapse>
      </Stack>

      <Stack borderBottom={'1px solid #D2D6E1'} pb={1}>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          onClick={() => setOpen3(!open3)}
          px={0.75}
          sx={{ cursor: 'pointer' }}
        >
          <Typography color={'text.secondary'} variant={'subtitle3'}>
            Third-party
          </Typography>
          <Icon
            component={TASKS_ARROW}
            sx={{
              width: 14,
              height: 14,
              ml: 'auto',
              transform: `rotate(${open3 ? '0' : '-.25'}turn)`,
              transition: 'all .3s',
            }}
          />
        </Stack>

        <Collapse in={open3}>
          <Stack gap={1} mt={0.5} width={'100%'}>
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
              px={0.75}
              py={0.5}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: '#F0F4FF',
                },
              }}
              width={'100%'}
            >
              <Typography variant={'body3'}>
                Title / Escrow (optional)
              </Typography>
              {taskHash?.[DashboardTaskKey.title_escrow] && (
                <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
              )}
            </Stack>
          </Stack>
        </Collapse>
      </Stack>

      {POSNotUndefined(taskHash?.[DashboardTaskKey.holdback_process]) && (
        <Stack borderBottom={'1px solid #D2D6E1'} pb={1}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            onClick={() => setOpen4(!open4)}
            px={0.75}
            sx={{ cursor: 'pointer' }}
          >
            <Typography color={'text.secondary'} variant={'subtitle3'}>
              Agreements
            </Typography>
            <Icon
              component={TASKS_ARROW}
              sx={{
                width: 14,
                height: 14,
                ml: 'auto',
                transform: `rotate(${open4 ? '0' : '-.25'}turn)`,
                transition: 'all .3s',
              }}
            />
          </Stack>

          <Collapse in={open4}>
            <Stack gap={1} mt={0.5} width={'100%'}>
              {POSNotUndefined(
                taskHash?.[DashboardTaskKey.holdback_process],
              ) && (
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  onClick={() =>
                    router.push({
                      pathname:
                        '/dashboard/tasks/construction-holdback-process',
                      query: {
                        loanId: POSGetParamsFromUrl(location.href).loanId,
                      },
                    })
                  }
                  px={0.75}
                  py={0.5}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      borderRadius: 1,
                      bgcolor: '#F0F4FF',
                    },
                  }}
                  width={'100%'}
                >
                  <Typography variant={'body3'}>
                    Construction holdback
                  </Typography>
                  {taskHash?.[DashboardTaskKey.holdback_process] && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              )}
            </Stack>
          </Collapse>
        </Stack>
      )}

      {POSNotUndefined(taskHash?.[DashboardTaskKey.referring_broker]) && (
        <Stack pb={1}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            onClick={() => setOpen5(!open5)}
            px={0.75}
            sx={{ cursor: 'pointer' }}
          >
            <Typography color={'text.secondary'} variant={'subtitle3'}>
              Broker
            </Typography>
            <Icon
              component={TASKS_ARROW}
              sx={{
                width: 14,
                height: 14,
                ml: 'auto',
                transform: `rotate(${open5 ? '0' : '-.25'}turn)`,
                transition: 'all .3s',
              }}
            />
          </Stack>

          <Collapse in={open5}>
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
              px={0.75}
              py={0.5}
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: '#F0F4FF',
                },
              }}
              width={'100%'}
            >
              <Typography variant={'body3'}>Referring broker</Typography>
              {taskHash?.[DashboardTaskKey.referring_broker] && (
                <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
              )}
            </Stack>
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
};
