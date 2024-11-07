import { FC, useCallback, useState } from 'react';
import { Collapse, Fade, Icon, Stack, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';

import { DashboardTaskKey } from '@/types';

import TASKS_ARROW from '@/svg/dashboard/tasks_arrow.svg';
import { useAsync } from 'react-use';

export const TasksRightMenu: FC = observer(() => {
  const router = useRouter();

  const {
    dashboardInfo: { taskMap, fetchTaskMap },
  } = useMst();

  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const [open4, setOpen4] = useState(true);
  const [open5, setOpen5] = useState(true);

  const onClickToRedirect = useCallback(
    async (key: string) => {
      const { loanId } = POSGetParamsFromUrl(location.href);
      await router.push({
        pathname: `/dashboard/tasks/${key}`,
        query: { loanId },
      });
    },
    [router],
  );

  const { loading } = useAsync(async () => {
    if (taskMap.size === 0) {
      await fetchTaskMap(POSGetParamsFromUrl(location.href)?.loanId);
    }
  }, [location.href]);

  const arrowSx = useCallback((open: boolean) => {
    return {
      width: 14,
      height: 14,
      ml: 'auto',
      transform: `rotate(${open ? '0' : '-.25'}turn)`,
      transition: 'all .3s',
    };
  }, []);

  const menuItemSx = useCallback(
    (key: string) => {
      return {
        px: 0.75,
        py: 0.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        bgcolor:
          router.pathname === `/dashboard/tasks/${key}` ? '#F0F4FF' : 'inherit',
        width: '100%',
        '&:hover': {
          cursor: 'pointer',
          borderRadius: 1,
          bgcolor: 'hsla(240, 10%, 96%, 1)',
        },
      };
    },
    [router.pathname],
  );

  return (
    <Fade in={!loading && taskMap.size !== 0}>
      <Stack flexShrink={0} gap={1} pr={1.5} py={1.5} width={240}>
        <Typography pl={0.75} variant={'subtitle2'}>
          Tasks
        </Typography>

        {(taskMap.has(DashboardTaskKey.payoff_amount) ||
          taskMap.has(DashboardTaskKey.rehab_info) ||
          taskMap.has(DashboardTaskKey.entitlements) ||
          taskMap.has(DashboardTaskKey.permits_obtained) ||
          taskMap.has(DashboardTaskKey.square_footage)) && (
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
              <Icon component={TASKS_ARROW} sx={() => arrowSx(open1)} />
            </Stack>

            <Collapse in={open1}>
              <Stack gap={1} mt={0.5} width={'100%'}>
                {taskMap.has(DashboardTaskKey.payoff_amount) && (
                  <Stack
                    onClick={() => onClickToRedirect('payoff-amount')}
                    sx={() => menuItemSx('payoff-amount')}
                  >
                    <Typography
                      color={
                        router.pathname === '/dashboard/tasks/payoff-amount'
                          ? '#2B52B6'
                          : 'text.primary'
                      }
                      variant={'body3'}
                    >
                      Payoff amount
                    </Typography>
                    {taskMap.get(DashboardTaskKey.payoff_amount) && (
                      <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                    )}
                  </Stack>
                )}

                {taskMap.has(DashboardTaskKey.rehab_info) && (
                  <Stack
                    onClick={() => onClickToRedirect('rehab-info')}
                    sx={() => menuItemSx('rehab-info')}
                  >
                    <Typography
                      color={
                        router.pathname === '/dashboard/tasks/rehab-info'
                          ? '#2B52B6'
                          : 'text.primary'
                      }
                      variant={'body3'}
                    >
                      Rehab info
                    </Typography>
                    {taskMap.get(DashboardTaskKey.rehab_info) && (
                      <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                    )}
                  </Stack>
                )}

                {taskMap.has(DashboardTaskKey.square_footage) && (
                  <Stack
                    onClick={() => onClickToRedirect('square-footage')}
                    sx={() => menuItemSx('square-footage')}
                  >
                    <Typography
                      color={
                        router.pathname === '/dashboard/tasks/square-footage'
                          ? '#2B52B6'
                          : 'text.primary'
                      }
                      variant={'body3'}
                    >
                      Square footage
                    </Typography>
                    {taskMap.get(DashboardTaskKey.square_footage) && (
                      <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                    )}
                  </Stack>
                )}

                {taskMap.has(DashboardTaskKey.entitlements) && (
                  <Stack
                    onClick={() => onClickToRedirect('entitlements')}
                    sx={() => menuItemSx('/dashboard/tasks/entitlements')}
                  >
                    <Typography
                      color={
                        router.pathname === '/dashboard/tasks/entitlements'
                          ? '#2B52B6'
                          : 'text.primary'
                      }
                      variant={'body3'}
                    >
                      Entitlements
                    </Typography>
                    {taskMap.get(DashboardTaskKey.entitlements) && (
                      <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                    )}
                  </Stack>
                )}

                {taskMap.has(DashboardTaskKey.permits_obtained) && (
                  <Stack
                    onClick={() => onClickToRedirect('permits-obtained')}
                    sx={() => menuItemSx('permits-obtained')}
                  >
                    <Typography
                      color={
                        router.pathname === '/dashboard/tasks/permits-obtained'
                          ? '#2B52B6'
                          : 'text.primary'
                      }
                      variant={'body3'}
                    >
                      Permits obtained
                    </Typography>
                    {taskMap.get(DashboardTaskKey.permits_obtained) && (
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
            <Icon component={TASKS_ARROW} sx={() => arrowSx(open2)} />
          </Stack>

          <Collapse in={open2}>
            <Stack gap={1} mt={0.5} width={'100%'}>
              <Stack
                onClick={() => onClickToRedirect('borrower')}
                sx={() => menuItemSx('borrower')}
              >
                <Typography variant={'body3'}>Borrower</Typography>
                {taskMap.get(DashboardTaskKey.borrower) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('co-borrower')}
                sx={() => menuItemSx('co-borrower')}
              >
                <Typography variant={'body3'}>Co-borrower</Typography>
                {taskMap.get(DashboardTaskKey.co_borrower) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('demographics-information')}
                sx={() => menuItemSx('demographics-information')}
              >
                <Typography variant={'body3'}>
                  Demographic information
                </Typography>
                {taskMap.get(DashboardTaskKey.demographics) && (
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
            <Icon component={TASKS_ARROW} sx={() => arrowSx(open3)} />
          </Stack>

          <Collapse in={open3}>
            <Stack gap={1} mt={0.5} width={'100%'}>
              <Stack
                onClick={() => onClickToRedirect('title-or-escrow-company')}
                sx={() => menuItemSx('title-or-escrow-company')}
              >
                <Typography variant={'body3'}>
                  Title / Escrow (optional)
                </Typography>
                {taskMap.get(DashboardTaskKey.title_escrow) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>
            </Stack>
          </Collapse>
        </Stack>

        {taskMap.has(DashboardTaskKey.holdback_process) && (
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
              <Icon component={TASKS_ARROW} sx={() => arrowSx(open4)} />
            </Stack>

            <Collapse in={open4}>
              <Stack gap={1} mt={0.5} width={'100%'}>
                <Stack
                  onClick={() =>
                    onClickToRedirect('construction-holdback-process')
                  }
                  sx={() => menuItemSx('construction-holdback-process')}
                >
                  <Typography variant={'body3'}>
                    Construction holdback
                  </Typography>
                  {taskMap.get(DashboardTaskKey.holdback_process) && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              </Stack>
            </Collapse>
          </Stack>
        )}

        {taskMap.has(DashboardTaskKey.referring_broker) && (
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
              <Icon component={TASKS_ARROW} sx={() => arrowSx(open5)} />
            </Stack>

            <Collapse in={open5}>
              <Stack gap={1} mt={0.5} width={'100%'}>
                <Stack
                  onClick={() => onClickToRedirect('referring-broker')}
                  sx={() => menuItemSx('referring-broker')}
                >
                  <Typography variant={'body3'}>Referring broker</Typography>
                  {taskMap.get(DashboardTaskKey.referring_broker) && (
                    <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                  )}
                </Stack>
              </Stack>
            </Collapse>
          </Stack>
        )}
      </Stack>
    </Fade>
  );
});
