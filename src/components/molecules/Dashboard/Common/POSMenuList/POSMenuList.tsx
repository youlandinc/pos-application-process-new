import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/router';

import { Box, SxProps, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { ISelectedProcessData } from '@/models/base';
import { SceneType } from '@/types';
import { POSFlex, POSFont } from '@/styles';
import {
  AccountBalanceOutlined,
  GradingOutlined,
  PeopleAltOutlined,
  PublicOutlined,
  TextSnippetOutlined,
  TimelineOutlined,
} from '@mui/icons-material';
import { ParseProcess } from '@/services/ParseProcess';
import {
  OPTIONS_COMMON_STATE,
  OPTIONS_MORTGAGE_OCCUPANCY,
  OPTIONS_MORTGAGE_PROPERTY,
} from '@/constants';
import { POSFindLabel } from '@/utils';

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

export const POSMenuList: FC<POSMenuListProps> = observer(({ scene, info }) => {
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
        router.push({ pathname: `/dashboard/${path}`, query: router.query });
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

  return (
    <>
      <Box sx={POSMenuListStyles}>{renderMenuList}</Box>
      <SidebarInfoBox info={info} />
    </>
  );
});

interface SidebarInfoBoxProps {
  info: ISelectedProcessData;
}

interface IBorrowerSummaryData {
  productType: string;
  address: string | ReactNode;
  occupancyType: string;
  propertyType: string;
}

const SidebarInfoBox: FC<SidebarInfoBoxProps> = observer((props) => {
  const { info } = props;
  const { data } = info;

  const [borrowerSummaryData, setBorrowerSummaryData] =
    useState<IBorrowerSummaryData>();

  useEffect(() => {
    if (data) {
      const parsedData = new ParseProcess(data);

      setBorrowerSummaryData({
        productType: parsedData.productType
          ?.toLowerCase()
          ?.replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
        address:
          parsedData.propertyAddress && parsedData.propertyAddress.address ? (
            <Box
              style={{
                ...POSFlex('flex-start', 'center', 'column'),
                width: '100%',
              }}
            >
              <Box
                style={{
                  wordBreak: 'break-all',
                  whiteSpace: 'break-spaces',
                  lineHeight: 1.5,
                }}
              >{`${parsedData.propertyAddress.address} ${
                parsedData.propertyAddress.aptNumber &&
                `, #${parsedData.propertyAddress.aptNumber}`
              }`}</Box>
              <Box>{`${
                parsedData.propertyAddress.city &&
                `${parsedData.propertyAddress.city}, `
              } ${parsedData.propertyAddress.state} ${
                parsedData.propertyAddress.postcode
              }`}</Box>
            </Box>
          ) : (
            OPTIONS_COMMON_STATE.find(
              (item) =>
                item.value ===
                (parsedData.propertyAddress &&
                  parsedData.propertyAddress.state),
            )?.label || ''
          ),
        occupancyType: POSFindLabel(
          OPTIONS_MORTGAGE_OCCUPANCY,
          parsedData.occupancyOpt || '',
        ),
        propertyType: POSFindLabel(
          OPTIONS_MORTGAGE_PROPERTY,
          parsedData.propertyOpt || '',
        ),
      });
    }
  }, [data]);

  return (
    <>
      {data && (
        <Box className={'product_card'} sx={useStyles}>
          <Typography mb={1} variant={'subtitle1'}>
            {borrowerSummaryData?.productType}
          </Typography>
          <Box className={'customInfo_list'} component={'ul'}>
            {borrowerSummaryData?.address && (
              <Box className={'customInfo_item'} component={'li'}>
                {borrowerSummaryData.address}
              </Box>
            )}
            {borrowerSummaryData?.occupancyType && (
              <Box className={'customInfo_item'} component={'li'}>
                {borrowerSummaryData.occupancyType}
              </Box>
            )}
            {borrowerSummaryData?.propertyType && (
              <Box className={'customInfo_item'} component={'li'} mt={1}>
                {borrowerSummaryData.propertyType}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
});

const useStyles = {
  '&.product_card': {
    mt: 3,
    width: '100%',
    borderRadius: 2,
    p: 3,
    bgcolor: 'action.hover',
  },
  '& .customInfo_list': {
    width: '100%',
    padding: 0,
    listStyle: 'none',
  },
  '& .customInfo_item': {
    color: 'text.primary',
    lineHeight: 1.5,
    width: '100%',
    fontSize: 14,
    display: 'flex',
  },
};
