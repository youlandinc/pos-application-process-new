import { ISelectedProcessData } from '@/models/base';
import { DashboardTaskInfo, MenuItems, SceneType } from '@/types';
import {
  AccountBalanceOutlined,
  FolderOpenOutlined,
  GradingOutlined,
  PeopleAltOutlined,
  TimelineOutlined,
} from '@mui/icons-material';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { DashboardSideInfoBox } from './component';
import { _fetchLoanTask } from '@/requests/dashboard';

type POSMenuListProps = {
  // info?: ISelectedProcessData;
  scene?: SceneType;
  // loading?: boolean;
};

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
    icon: <TimelineOutlined />,
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
  ({
    scene,
    // info, loading
  }) => {
    // const store = useMst();
    const router = useRouter();
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
      <>
        <Box
          pt={{ md: 6, xs: 2 }}
          sx={{
            '& .item': {
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'info.darker',
              },
              '&.active': {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                position: 'relative',
                '&::after': {
                  content: '""',
                  height: '100%',
                  width: 2,
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
              },
              '& svg': {
                verticalAlign: 'middle',
                mr: 1,
              },
            },
          }}
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
                py={1.8}
              >
                {icon} {label}
              </Box>
            );
          })}
        </Box>
        {/*<DashboardSideInfoBox info={info} loading={loading} />*/}
      </>
    );
  },
);
