import { StyledTooltip } from '@/components/atoms';
import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Skeleton, Stack, Typography } from '@mui/material';

import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_COMMON_STATE, TASK_URL_HASH } from '@/constants';
import { useBreakpoints } from '@/hooks';

import { POSMenuSelect } from './index';

import { LayoutSceneTypeEnum, MenuItems } from '@/types';

import ICON_DASHBOARD_OVERVIEW from './assets/icon_dashboard_overview.svg';
import ICON_DASHBOARD_TASKS from './assets/icon_dashboard_task.svg';
import ICON_DASHBOARD_TERMS from './assets/icon_dashboard_term.svg';
import ICON_DASHBOARD_APPRAISAL from './assets/icon_dashboard_appraisal.svg';
import ICON_DASHBOARD_DOCUMENTS from './assets/icon_dashboard_documents.svg';
import ICON_DASHBOARD_TEAM from './assets/icon_dashboard_team.svg';
import ICON_RIGHT_ARROW from './assets/icon_right_arrow.svg';

interface POSMenuListProps {
  scene?: LayoutSceneTypeEnum;
  loading?: boolean;
}

const DASHBOARD_MENU_LIST: MenuItems[] = [
  {
    label: 'Overview',
    path: 'overview',
    key: 'overview',
    icon: (
      <Icon
        component={ICON_DASHBOARD_OVERVIEW}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    label: 'Tasks',
    path: 'tasks',
    key: 'tasks',
    icon: (
      <Icon
        component={ICON_DASHBOARD_TASKS}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    label: 'Terms',
    path: 'terms',
    key: 'terms',
    icon: (
      <Icon
        component={ICON_DASHBOARD_TERMS}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    label: 'Appraisal',
    path: 'appraisal',
    key: 'appraisal',
    icon: (
      <Icon
        component={ICON_DASHBOARD_APPRAISAL}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    label: 'Documents',
    path: 'documents',
    key: 'documents',
    icon: (
      <Icon
        component={ICON_DASHBOARD_DOCUMENTS}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
  {
    label: 'Team',
    path: 'team',
    key: 'team',
    icon: (
      <Icon
        component={ICON_DASHBOARD_TEAM}
        sx={{
          width: 20,
          height: 20,
        }}
      />
    ),
  },
];

export const POSMenuList: FC<POSMenuListProps> = observer(({ loading }) => {
  const router = useRouter();
  const { dashboardInfo } = useMst();

  const breakpoint = useBreakpoints();

  const [firstRender, setFirstRender] = useState(true);
  const [activeKey, setActiveKey] = useState(() => {
    const results = router.pathname.split('/');
    const result = results[results.length - 1];
    return result === 'documents' ? 'documents' : results[2];
  });

  const selectMenu = useCallback(
    (path: string, key: string) => {
      return async () => {
        if (key === 'resources') {
          window.open('https://youland.com/company/newsroom/', '_blank');
        }
        if (key === activeKey && key !== 'tasks') {
          return;
        }
        setActiveKey(key);
        if (path === 'tasks') {
          await dashboardInfo.fetchTaskMap(router.query.loanId as string);
          const target = dashboardInfo.findFirst();
          await router.push({
            pathname: `${TASK_URL_HASH[target]}`,
            query: { loanId: router.query.loanId },
          });
        } else {
          await router.push({
            pathname: `/dashboard/${path}`,
            query: { loanId: router.query.loanId },
          });
        }
      };
    },
    [activeKey, dashboardInfo, router],
  );

  useEffect(() => {
    dashboardInfo?.propertyAddress && setFirstRender(false);
  }, [dashboardInfo?.propertyAddress]);

  return (
    <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={1.5}>
      {!['xs', 'sm', 'md'].includes(breakpoint) ? (
        <Stack
          flexDirection={'row'}
          sx={(theme) => {
            const fillColor = theme.palette.primary.main;
            const pseudo = ['xs', 'sm', 'md'].includes(breakpoint)
              ? {
                  content: '""',
                  height: '100%',
                  width: 2,
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }
              : {
                  content: '""',
                  height: 2,
                  width: '100%',
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                };

            return {
              height: 'auto',
              '& .item': {
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'info.darker',
                },
                '&.active': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  position: 'relative',
                  '&::after': pseudo,
                  '& svg > path': {
                    fill: fillColor,
                  },
                },
                '& svg': {
                  verticalAlign: 'middle',
                  mr: 0.5,
                },
              },
            };
          }}
          width={'100%'}
        >
          {DASHBOARD_MENU_LIST.map(({ path, key, label, icon }) => {
            return (
              <Box
                className={activeKey === key ? 'active item' : 'item'}
                color={'text.hover'}
                fontSize={14}
                key={key}
                lineHeight={1.5}
                onClick={selectMenu(path, key)}
                px={{ xs: 1.5, xl: 2, xxl: 3 }}
                py={1}
                sx={{
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              >
                {['xs', 'sm', 'md', 'xl', 'xxl'].includes(breakpoint) && icon}
                {label}
              </Box>
            );
          })}
        </Stack>
      ) : (
        <POSMenuSelect
          onChange={(path, key) => selectMenu(path, key)()}
          options={DASHBOARD_MENU_LIST}
          value={activeKey}
        />
      )}

      {/*dashboard info*/}
      <Stack
        flexShrink={0}
        height={{ xs: 'fit-content', lg: 42 }}
        order={{ xs: 1, lg: 2 }}
        width={'fit-content'}
      >
        {loading || firstRender ? (
          <Stack alignItems={'flex-end'} width={320}>
            <Skeleton animation={'wave'} height={18} width={'100%'} />
            <Skeleton animation={'wave'} height={18} width={200} />
          </Stack>
        ) : (
          <>
            {dashboardInfo?.additionalAddress?.length > 0 ? (
              <StyledTooltip
                mode={
                  ['xs', 'sm', 'md'].includes(breakpoint) ? 'click' : 'hover'
                }
                placement={
                  ['xs', 'sm', 'md'].includes(breakpoint)
                    ? 'bottom-end'
                    : 'bottom'
                }
                title={
                  <Stack gap={1}>
                    <Typography variant={'body2'}>
                      {dashboardInfo?.propertyAddress &&
                        (dashboardInfo?.propertyAddress.formatAddress
                          ? [
                              dashboardInfo.propertyAddress?.formatAddress &&
                                `${dashboardInfo.propertyAddress.formatAddress},`,
                              dashboardInfo.propertyAddress?.aptNumber &&
                                `${dashboardInfo.propertyAddress.aptNumber},`,
                              dashboardInfo.propertyAddress?.city &&
                                `${dashboardInfo.propertyAddress.city},`,
                              dashboardInfo.propertyAddress?.state,
                              dashboardInfo.propertyAddress?.postcode,
                            ]
                              .filter(Boolean)
                              .join(' ')
                          : OPTIONS_COMMON_STATE.find(
                              (item) =>
                                item.value ===
                                (dashboardInfo?.propertyAddress &&
                                  dashboardInfo?.propertyAddress.state),
                            )?.label || '')}
                    </Typography>
                    {dashboardInfo?.additionalAddress?.map((item, index) => (
                      <Typography
                        key={`${item?.formatAddress}-${index}`}
                        variant={'body2'}
                      >
                        {[
                          item?.formatAddress,
                          item?.aptNumber && `${item?.aptNumber},`,
                          item?.city && `${item?.city},`,
                          item?.state,
                          item?.postcode,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </Typography>
                    ))}
                  </Stack>
                }
                tooltipSx={{ width: 'fit-content' }}
              >
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  gap={0.25}
                  justifyContent={{ xs: 'unset', lg: 'flex-end' }}
                  sx={{ cursor: 'pointer', width: '100%' }}
                >
                  <Typography color={'text.primary'} variant={'body2'}>
                    Multiple addresses (
                    {dashboardInfo?.additionalAddress?.length + 1})
                  </Typography>
                  <Icon
                    component={ICON_RIGHT_ARROW}
                    sx={{ width: 12, height: 12 }}
                  />
                </Stack>
              </StyledTooltip>
            ) : (
              <Typography
                color={'text.primary'}
                textAlign={{ xs: 'left', lg: 'right' }}
                variant={'body2'}
              >
                {dashboardInfo?.propertyAddress &&
                  (dashboardInfo?.propertyAddress.formatAddress
                    ? [
                        dashboardInfo.propertyAddress?.formatAddress &&
                          `${dashboardInfo.propertyAddress.formatAddress},`,
                        dashboardInfo.propertyAddress?.aptNumber &&
                          `${dashboardInfo.propertyAddress.aptNumber},`,
                        dashboardInfo.propertyAddress?.city &&
                          `${dashboardInfo.propertyAddress.city},`,
                        dashboardInfo.propertyAddress?.state,
                        dashboardInfo.propertyAddress?.postcode,
                      ]
                        .filter(Boolean)
                        .join(' ')
                    : OPTIONS_COMMON_STATE.find(
                        (item) =>
                          item.value === dashboardInfo?.propertyAddress?.state,
                      )?.label || '')}
                {/*{dashboardInfo?.propertyAddress &&*/}
                {/*  (dashboardInfo?.propertyAddress.formatAddress*/}
                {/*    ? `${*/}
                {/*        dashboardInfo.propertyAddress?.formatAddress*/}
                {/*          ? `${dashboardInfo.propertyAddress?.formatAddress}, `*/}
                {/*          : ''*/}
                {/*      }${*/}
                {/*        dashboardInfo.propertyAddress?.aptNumber*/}
                {/*          ? `${dashboardInfo.propertyAddress?.aptNumber}, `*/}
                {/*          : ''*/}
                {/*      } ${*/}
                {/*        dashboardInfo.propertyAddress?.city*/}
                {/*          ? `${dashboardInfo.propertyAddress?.city}, `*/}
                {/*          : ''*/}
                {/*      }${*/}
                {/*        dashboardInfo.propertyAddress?.state*/}
                {/*          ? `${dashboardInfo.propertyAddress?.state} `*/}
                {/*          : ''*/}
                {/*      }${*/}
                {/*        dashboardInfo.propertyAddress?.postcode*/}
                {/*          ? `${dashboardInfo.propertyAddress?.postcode}`*/}
                {/*          : ''*/}
                {/*      }`*/}
                {/*    : OPTIONS_COMMON_STATE.find(*/}
                {/*        (item) =>*/}
                {/*          item.value ===*/}
                {/*          (dashboardInfo?.propertyAddress &&*/}
                {/*            dashboardInfo?.propertyAddress.state),*/}
                {/*      )?.label || '')}*/}
              </Typography>
            )}

            <Typography
              color={'text.secondary'}
              fontSize={14}
              textAlign={{ xs: 'left', lg: 'right' }}
            >
              Loan number: {dashboardInfo?.loanNumber}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
});
