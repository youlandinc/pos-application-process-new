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

import { OPTIONS_COMMON_STATE } from '@/constants';
import { useBreakpoints } from '@/hooks';

import { POSMenuSelect } from './index';

import { LayoutSceneTypeEnum, MenuItems } from '@/types';

import ICON_APPRAISAL from './assets/icon_appraisal.svg';
import ICON_LOAN_TERMS from './assets/icon_loan_terms.svg';

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
      <AccountBalanceOutlined
        sx={{
          '& path': {
            fill: '#636A7C',
          },
        }}
      />
    ),
  },
  {
    label: 'Tasks',
    path: 'tasks',
    key: 'tasks',
    icon: (
      <GradingOutlined
        sx={{
          width: 20,
          height: 20,
          '& path': {
            fill: '#636A7C',
          },
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
        component={ICON_LOAN_TERMS}
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
        component={ICON_APPRAISAL}
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
      <FolderOpenOutlined
        sx={{
          width: 20,
          height: 20,
          '& path': {
            fill: '#636A7C',
          },
        }}
      />
    ),
  },
  {
    label: 'Team',
    path: 'team',
    key: 'team',
    icon: (
      <PeopleAltOutlined
        sx={{
          width: 20,
          height: 20,
          '& path': {
            fill: '#636A7C',
          },
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
                  '& .icon_appraisal_svg__theme-color, & svg > path, & .icon_loan_terms_svg__theme-color':
                    {
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
    </Stack>
  );
});
