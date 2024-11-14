import { FC, useCallback, useMemo } from 'react';
import { Icon, Stack, Theme, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';

import ICON_UNCOMPLETED from './assets/icon_uncompleted.svg';
import ICON_COMPLETED from './assets/icon_completed.svg';
import { DashboardTaskKey } from '@/types';

export const OverviewChecklist: FC = observer(() => {
  const router = useRouter();

  const {
    dashboardInfo: { taskMap },
  } = useMst();

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

  const menuItemSx = useMemo(() => {
    return {
      pl: 1,
      py: 0.5,
      gap: 1.5,
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      cursor: 'pointer',
      borderRadius: 2,
      color: 'text.primary',
      '&:hover': {
        bgcolor: 'primary.lighter',
        color: 'primary.contrastHover',
      },
    };
  }, []);

  const menuItemNameSx = useMemo(() => {
    return {
      color: 'inherit',
      fontSize: 14,
    };
  }, []);

  const menuItemIconSx = useMemo(() => {
    return {
      width: 24,
      height: 24,
      '& path': {
        fill: (theme: Theme) => theme.palette.primary.main,
      },
    };
  }, []);

  return (
    <Stack width={'100%'}>
      <Typography fontSize={{ xs: 16, md: 20 }}>
        Your tasks checklist
      </Typography>

      <Stack
        gap={1}
        sx={{
          '& .sub_menu': {
            '&:first-of-type': {
              mt: 2.5,
            },
            '&:not(:last-of-type)': {
              pb: 1,
              borderBottom: '1px solid #D2D6E1',
            },
          },
        }}
        width={'100%'}
      >
        {(taskMap.has(DashboardTaskKey.payoff_amount) ||
          taskMap.has(DashboardTaskKey.rehab_info) ||
          taskMap.has(DashboardTaskKey.entitlements) ||
          taskMap.has(DashboardTaskKey.permits_obtained) ||
          taskMap.has(DashboardTaskKey.square_footage)) && (
          <Stack className={'sub_menu'}>
            <Typography color={'text.secondary'} variant={'subtitle2'}>
              Loan information
            </Typography>

            <Stack gap={1} mt={0.5} width={'100%'}>
              <Stack
                onClick={() => onClickToRedirect('payoff-amount')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.payoff_amount)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Payoff amount</Typography>
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('rehab-info')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.rehab_info)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Rehab info</Typography>
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('square-footage')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.square_footage)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Square footage</Typography>
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('entitlements')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.entitlements)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Entitlements</Typography>
              </Stack>

              <Stack
                onClick={() => onClickToRedirect('permits-obtained')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.permits_obtained)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Permits obtained</Typography>
              </Stack>
            </Stack>
          </Stack>
        )}

        <Stack className={'sub_menu'}>
          <Typography color={'text.secondary'} variant={'subtitle2'}>
            Borrower information
          </Typography>

          <Stack gap={1} mt={0.5} width={'100%'}>
            <Stack
              onClick={() => onClickToRedirect('borrower')}
              sx={menuItemSx}
            >
              <Icon
                component={
                  taskMap.get(DashboardTaskKey.borrower)
                    ? ICON_COMPLETED
                    : ICON_UNCOMPLETED
                }
                sx={menuItemIconSx}
              />
              <Typography sx={menuItemNameSx}>Borrower</Typography>
            </Stack>

            <Stack
              onClick={() => onClickToRedirect('co-borrower')}
              sx={menuItemSx}
            >
              <Icon
                component={
                  taskMap.get(DashboardTaskKey.co_borrower)
                    ? ICON_COMPLETED
                    : ICON_UNCOMPLETED
                }
                sx={menuItemIconSx}
              />
              <Typography sx={menuItemNameSx}>Co-borrower</Typography>
            </Stack>

            <Stack
              onClick={() => onClickToRedirect('demographics-information')}
              sx={menuItemSx}
            >
              <Icon
                component={
                  taskMap.get(DashboardTaskKey.demographics)
                    ? ICON_COMPLETED
                    : ICON_UNCOMPLETED
                }
                sx={menuItemIconSx}
              />
              <Typography sx={menuItemNameSx}>Demographics</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack className={'sub_menu'}>
          <Typography color={'text.secondary'} variant={'subtitle2'}>
            Third-party
          </Typography>

          <Stack gap={1} mt={0.5} width={'100%'}>
            <Stack
              onClick={() => onClickToRedirect('title-or-escrow-company')}
              sx={menuItemSx}
            >
              <Icon
                component={
                  taskMap.get(DashboardTaskKey.title_escrow)
                    ? ICON_COMPLETED
                    : ICON_UNCOMPLETED
                }
                sx={menuItemIconSx}
              />
              <Typography sx={menuItemNameSx}>
                Title / Escrow (optional)
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {taskMap.has(DashboardTaskKey.holdback_process) && (
          <Stack className={'sub_menu'}>
            <Typography color={'text.secondary'} variant={'subtitle2'}>
              Agreements
            </Typography>

            <Stack gap={1} mt={0.5} width={'100%'}>
              <Stack
                onClick={() =>
                  onClickToRedirect('construction-holdback-process')
                }
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.holdback_process)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>
                  Construction holdback
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}

        {taskMap.has(DashboardTaskKey.referring_broker) && (
          <Stack className={'sub_menu'}>
            <Typography color={'text.secondary'} variant={'subtitle2'}>
              Broker
            </Typography>

            <Stack gap={1} mt={0.5} width={'100%'}>
              <Stack
                onClick={() => onClickToRedirect('referring-broker')}
                sx={menuItemSx}
              >
                <Icon
                  component={
                    taskMap.get(DashboardTaskKey.referring_broker)
                      ? ICON_COMPLETED
                      : ICON_UNCOMPLETED
                  }
                  sx={menuItemIconSx}
                />
                <Typography sx={menuItemNameSx}>Referring broker</Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
});
