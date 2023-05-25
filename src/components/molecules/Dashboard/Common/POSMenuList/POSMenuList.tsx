import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Box, SxProps } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { ISelectedProcessData } from '@/models/base';
import { SceneType } from '@/types';
import { POSFont } from '@/styles';
import {
  AccountBalanceOutlined,
  GradingOutlined,
  PeopleAltOutlined,
  PublicOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from '@mui/icons-material';

type POSMenuListProps = {
  info: ISelectedProcessData;
  scene: SceneType;
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
  {
    label: 'Resources',
    path: 'resources',
    key: 'resources',
    icon: <PublicOutlined />,
  },
];

const POSMenuListStyles: SxProps = {
  '& .item': {
    px: 3,
    py: 1.8,
    cursor: 'pointer',
    ...POSFont(16, 400, 1.5, 'text.hover'),
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
} as const;

export const POSMenuList: FC<POSMenuListProps> = observer(({ scene }) => {
  // const store = useMst();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(router.pathname.split('/')[2]);

  const selectMenu = useCallback(
    (path: string, key: string): (() => void) => {
      return () => {
        if (key === 'resources') {
          window.open('https://youland.com/company/newsroom/', '_blank');
        }
        if (key === activeKey) {
          return;
        }
        setActiveKey(key);
        router.push(`/dashboard/${path}`);
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
          if (next.key !== 'preapproval_letter') {
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
          key={key}
          onClick={selectMenu(path, key)}
        >
          {icon} {label}
        </Box>
      );
    });
  }, [activeKey, scene, selectMenu]);

  return <Box sx={POSMenuListStyles}>{renderMenuList}</Box>;
});
