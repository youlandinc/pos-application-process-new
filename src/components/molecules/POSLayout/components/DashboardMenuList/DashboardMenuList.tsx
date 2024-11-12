import { FC, useCallback, useState } from 'react';
import { Box, Icon, Stack } from '@mui/material';
import {
  AccountBalanceOutlined,
  FolderOpenOutlined,
  GradingOutlined,
  PeopleAltOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { useBreakpoints } from '@/hooks';

import { DashboardSideInfoBox } from './index';

import { LayoutSceneTypeEnum, MenuItems } from '@/types';
import { IDashboardInfo } from '@/models/base/DashboardInfo';

import APPRAISAL_ICON from './Appraisal.svg';

interface POSMenuListProps {
  info: IDashboardInfo;
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
    icon: <Icon component={APPRAISAL_ICON} />,
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

export const DashboardMenuList: FC<POSMenuListProps> = observer(
  ({ loading, info }) => {
    const router = useRouter();

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
          <DashboardSideInfoBox info={info} loading={loading} />
        )}
      </Stack>
    );
  },
);
