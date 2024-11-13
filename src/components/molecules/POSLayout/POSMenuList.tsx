import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Skeleton, Stack, Typography } from '@mui/material';
import {
  AccountBalanceOutlined,
  FolderOpenOutlined,
  GradingOutlined,
  PeopleAltOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';

import { LayoutSceneTypeEnum, MenuItems } from '@/types';

import ICON_APPRAISAL from './assets/icon_appraisal.svg';
import { OPTIONS_COMMON_STATE } from '@/constants';

interface POSMenuListProps {
  scene?: LayoutSceneTypeEnum;
  loading?: boolean;
}

const DASHBOARD_MENU_LIST: MenuItems[] = [
  {
    label: 'Overview',
    path: 'overview',
    key: 'overview',
    icon: <AccountBalanceOutlined />,
  },
  {
    label: 'Tasks',
    path: 'tasks',
    key: 'tasks',
    icon: <GradingOutlined />,
  },
  {
    label: 'Appraisal',
    path: 'appraisal',
    key: 'appraisal',
    icon: <Icon component={ICON_APPRAISAL} />,
  },
  {
    label: 'Documents',
    path: 'documents',
    key: 'documents',
    icon: <FolderOpenOutlined />,
  },
  {
    label: 'Team',
    path: 'team',
    key: 'team',
    icon: <PeopleAltOutlined />,
  },
];

export const POSMenuList: FC<POSMenuListProps> = observer(({ loading }) => {
  const router = useRouter();
  const { dashboardInfo } = useMst();

  const [firstRender, setFirstRender] = useState(true);

  const breakpoint = useBreakpoints();

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
        await router.push({
          pathname: `/dashboard/${path}`,
          query: { loanId: router.query.loanId },
        });
      };
    },
    [activeKey, router],
  );

  useEffect(() => {
    dashboardInfo?.propertyAddress && setFirstRender(false);
  }, [dashboardInfo?.propertyAddress]);

  return (
    <Stack
      alignItems={'flex-end'}
      flexDirection={{ xs: 'column', lg: 'row' }}
      height={{ xs: 'auto', lg: 40 }}
    >
      <Stack
        flexDirection={{ xs: 'column', lg: 'row' }}
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
                '& .Appraisal_svg__theme-color': {
                  fill: fillColor,
                },
              },
              '& svg': {
                verticalAlign: 'middle',
                mr: 1,
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
              fontSize={16}
              key={key}
              lineHeight={1.5}
              onClick={selectMenu(path, key)}
              px={3}
              py={{ xs: 1.8, lg: 1 }}
            >
              {['xs', 'sm', 'md', 'xxl'].includes(breakpoint) && icon}
              {label}
            </Box>
          );
        })}
      </Stack>
      {!['xs', 'sm', 'md'].includes(breakpoint) && (
        <Stack flexShrink={0} height={40} width={'fit-content'}>
          {loading || firstRender ? (
            <Stack alignItems={'flex-end'} width={320}>
              <Skeleton animation={'wave'} height={18} width={'100%'} />
              <Skeleton animation={'wave'} height={18} width={200} />
            </Stack>
          ) : (
            <>
              <Typography
                color={'text.primary'}
                textAlign={{ xs: 'left', lg: 'right' }}
                variant={'body2'}
              >
                {dashboardInfo?.propertyAddress &&
                  (dashboardInfo?.propertyAddress.formatAddress
                    ? `${
                        dashboardInfo.propertyAddress?.formatAddress
                          ? `${dashboardInfo.propertyAddress?.formatAddress}, `
                          : ''
                      }${
                        dashboardInfo.propertyAddress?.aptNumber
                          ? `${dashboardInfo.propertyAddress?.aptNumber}, `
                          : ''
                      } ${
                        dashboardInfo.propertyAddress?.city
                          ? `${dashboardInfo.propertyAddress?.city}, `
                          : ''
                      }${
                        dashboardInfo.propertyAddress?.state
                          ? `${dashboardInfo.propertyAddress?.state} `
                          : ''
                      }${
                        dashboardInfo.propertyAddress?.postcode
                          ? `${dashboardInfo.propertyAddress?.postcode}`
                          : ''
                      }`
                    : OPTIONS_COMMON_STATE.find(
                        (item) =>
                          item.value ===
                          (dashboardInfo?.propertyAddress &&
                            dashboardInfo?.propertyAddress.state),
                      )?.label || '')}
              </Typography>

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
      )}
    </Stack>
  );
});
