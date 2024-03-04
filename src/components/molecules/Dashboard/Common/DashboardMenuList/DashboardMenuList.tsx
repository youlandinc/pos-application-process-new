import { ISelectedProcessData } from '@/models/base';
import { DashboardTaskInfo, SceneType } from '@/types';
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
  info: ISelectedProcessData;
  scene: SceneType;
  loading?: boolean;
};

interface MenuItems {
  key: string;
  label: string;
  path: string;
  icon: ReactNode;
}

const list: MenuItems[] = [
  {
    label: 'Overview',
    path: 'overview',
    key: 'overview',
    icon: <AccountBalanceOutlined />,
  },
  {
    label: 'Application summary',
    path: 'application_summary',
    key: 'application_summary',
    icon: <GradingOutlined />,
  },
  {
    label: 'Tasks',
    path: 'tasks',
    key: 'tasks',
    icon: <GradingOutlined />,
  },
  {
    label: 'Rates',
    path: 'rates',
    key: 'rates',
    icon: <TimelineOutlined />,
  },
  {
    label: 'Documents',
    path: 'documents',
    key: 'documents',
    icon: <FolderOpenOutlined />,
  },
  //{
  //  label: 'Loan Estimate',
  //  path: 'loan_estimate',
  //  key: 'loan_estimate',
  //},
  {
    label: 'My team',
    path: 'team',
    key: 'team',
    icon: <PeopleAltOutlined />,
  },
  //{
  //  label: 'Resources',
  //  path: 'resources',
  //  key: 'resources',
  //  icon: <PublicOutlined />,
  //},
];

export const DashboardMenuList: FC<POSMenuListProps> = observer(
  ({ scene, info, loading }) => {
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
          if (key === 'documents') {
            const {
              data: { tasks },
            } = await _fetchLoanTask(router.query.processId as string);

            const taskId: string = Object.keys(tasks).reduce((acc, cur) => {
              if (cur.includes('_DOCUMENTS_DOCUMENTS')) {
                acc = (tasks as Record<string, DashboardTaskInfo>)[cur].taskId;
              }
              return acc;
            }, '');

            await router.push({
              pathname: '/dashboard/tasks/documents/',
              query: {
                processId: router.query.processId,
                taskId,
              },
            });
            return;
          }
          await router.push({
            pathname: `/dashboard/${path}`,
            query: { processId: router.query.processId },
          });
        };
      },
      [activeKey, router],
    );

    const renderMenuList = useMemo(() => {
      let formatMenuList: MenuItems[] = [];
      switch (scene) {
        case 'mortgage purchase':
          formatMenuList = list;
          break;
        case 'mortgage refinance':
          formatMenuList = list.reduce((acc: MenuItems[], next: MenuItems) => {
            if (next.key !== 'pre_approval_letter') {
              acc.push(next);
            }
            return acc;
          }, []);
          break;
        case SceneType.bridge_purchase:
        case SceneType.bridge_refinance:
        case SceneType.fix_purchase:
        case SceneType.fix_refinance:
        case SceneType.ground_purchase:
        case SceneType.ground_refinance:
          formatMenuList = list.reduce((acc: MenuItems[], next: MenuItems) => {
            if (next.key !== 'application_summary') {
              acc.push(next);
            }
            return acc;
          }, []);
          break;
      }
      if (formatMenuList.length < 1) {
        return null;
      }
      return formatMenuList.map(({ path, key, label, icon }) => {
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
      });
    }, [activeKey, scene, selectMenu]);

    return (
      <>
        <Box
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
          {renderMenuList}
        </Box>
        <DashboardSideInfoBox info={info} loading={loading} />
      </>
    );
  },
);
