import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import {
  AccountBalanceOutlined,
  GradingOutlined,
  PeopleAltOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { ISelectedProcessData } from '@/models/base';
import { SceneType } from '@/types';

import { DashboardSideInfoBox } from './component';

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
    label: 'Pre-approval letter',
    path: 'pre_approval_letter',
    key: 'pre_approval_letter',
    icon: <TextSnippetOutlined />,
  },
  //{
  //  label: 'Loan Estimate',
  //  path: 'loan_estimate',
  //  key: 'loan_estimate',
  //},
  {
    label: 'My Team',
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
    const [activeKey, setActiveKey] = useState(router.pathname.split('/')[2]);

    const selectMenu = useCallback(
      (path: string, key: string): (() => void) => {
        return () => {
          if (key === 'resources') {
            window.open('https://youland.com/company/newsroom/', '_blank');
          }
          if (key === activeKey && key !== 'tasks') {
            return;
          }
          setActiveKey(key);
          router.push({
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
        case 'bridge purchase':
        case 'bridge refinance':
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
                bgcolor: 'action.hover',
              },
              '&.active': {
                bgcolor: 'primary.A200',
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
