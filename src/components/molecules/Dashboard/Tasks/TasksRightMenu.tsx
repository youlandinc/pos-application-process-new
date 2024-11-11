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
        pl: 1.5,
        pr: 0.75,
        py: 0.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        borderRadius: 1,
        '&:hover': {
          cursor: 'pointer',
          bgcolor: 'hsla(240, 10%, 96%, 1)',
        },
        bgcolor:
          router.pathname === `/dashboard/tasks/${key}` ? '#F0F4FF' : 'inherit',
      };
    },
    [router.pathname],
  );

  const menuItemNameSx = useCallback(
    (key: string) => {
      return {
        color:
          router.pathname === `/dashboard/tasks/${key}`
            ? '#2B52B6'
            : 'text.primary',
        fontSize: 13,
      };
    },
    [router.pathname],
  );

  return (
    <Fade in={!loading && taskMap.size !== 0}>
      <Stack
        bgcolor={'#F8F9FC'}
        borderRadius={2}
        flexShrink={0}
        gap={1}
        height={'fit-content'}
        px={1.5}
        py={1.5}
        sx={{
          '& .sub_menu': {
            '&:not(:last-of-type)': {
              pb: 1,
              borderBottom: '1px solid #D2D6E1',
            },
          },
        }}
        width={280}
      >
        <Typography mb={0.5} pl={0.75} variant={'subtitle2'}>
          Jump to task
        </Typography>

        {(taskMap.has(DashboardTaskKey.payoff_amount) ||
          taskMap.has(DashboardTaskKey.rehab_info) ||
          taskMap.has(DashboardTaskKey.entitlements) ||
          taskMap.has(DashboardTaskKey.permits_obtained) ||
          taskMap.has(DashboardTaskKey.square_footage)) && (
          <Stack className={'sub_menu'}>
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
                    <Typography sx={() => menuItemNameSx('payoff-amount')}>
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
                    <Typography sx={() => menuItemNameSx('rehab-info')}>
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
                    <Typography sx={() => menuItemNameSx('square-footage')}>
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
                    sx={() => menuItemSx('entitlements')}
                  >
                    <Typography sx={() => menuItemNameSx('entitlements')}>
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
                    <Typography sx={() => menuItemNameSx('permits-obtained')}>
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

        <Stack className={'sub_menu'}>
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
                <Typography sx={() => menuItemNameSx('borrower')}>
                  Borrower
                </Typography>
                {taskMap.get(DashboardTaskKey.borrower) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('co-borrower')}
                sx={() => menuItemSx('co-borrower')}
              >
                <Typography sx={() => menuItemNameSx('co-borrower')}>
                  Co-borrower
                </Typography>
                {taskMap.get(DashboardTaskKey.co_borrower) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('demographics-information')}
                sx={() => menuItemSx('demographics-information')}
              >
                <Typography
                  sx={() => menuItemNameSx('demographics-information')}
                >
                  Demographic information
                </Typography>
                {taskMap.get(DashboardTaskKey.demographics) && (
                  <CheckCircle color={'success'} sx={{ fontSize: 18 }} />
                )}
              </Stack>
            </Stack>
          </Collapse>
        </Stack>

        <Stack className={'sub_menu'}>
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
                <Typography
                  sx={() => menuItemNameSx('title-or-escrow-company')}
                >
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
          <Stack className={'sub_menu'}>
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
                  <Typography
                    sx={() => menuItemNameSx('construction-holdback-process')}
                  >
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
          <Stack className={'sub_menu'}>
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
                  <Typography sx={() => menuItemNameSx('referring-broker')}>
                    Referring broker
                  </Typography>
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
