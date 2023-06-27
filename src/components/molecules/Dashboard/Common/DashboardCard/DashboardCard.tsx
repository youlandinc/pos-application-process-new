import { FC, ReactNode } from 'react';
import { Box, Divider, Stack, StackProps, Typography } from '@mui/material';

import { POSFormatDollar } from '@/utils';
import { useBreakpoints } from '@/hooks';

import { StyledLoading } from '@/components/atoms';
import { DashboardCardItem } from '@/components/molecules';

interface DashboardCardProps extends StackProps {
  loading: boolean;
  title?: string;
  subTitle?: string;
  subInfo?: string;
  dataList?: { label: string; info: string | ReactNode }[];
}

export interface BridgeOverviewInfo {
  title?: string;
  subTitle?: string;
  subInfo?: string;
  info: {
    label: string;
    info: string | ReactNode;
  }[];
}

export const DashboardCard: FC<DashboardCardProps> = ({
  loading,
  title = 'Purchase',
  subTitle = 'Total loan amount',
  subInfo = POSFormatDollar(125000),
  dataList = [
    {
      label: 'Purchase Price',
      info: POSFormatDollar(125000),
    },
  ],
  children,
  ...rest
}) => {
  const breakpoint = useBreakpoints();
  return (
    <Stack
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      flex={{ xl: 1, xs: '100%' }}
      flexDirection={'column'}
      p={3}
      width={'100%'}
      {...rest}
    >
      {loading ? (
        <StyledLoading sx={{ m: 'auto', color: 'primary.main' }} />
      ) : (
        <>
          <Typography
            color={'text.primary'}
            component={'div'}
            variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h4'}
          >
            <Box>{title}</Box>
          </Typography>
          <Box my={1.5}>
            <DashboardCardItem
              info={
                <Typography
                  color={'primary.main'}
                  component={'div'}
                  variant={
                    ['xs', 'sm', 'md'].includes(breakpoint) ? 'h7' : 'h4'
                  }
                >
                  {subInfo}
                </Typography>
              }
              label={subTitle}
            />
            <Divider sx={{ py: 1 }} />
            {dataList.map((item, index) => (
              <DashboardCardItem
                info={item.info}
                key={`${index}_${item.label}_${item.info}`}
                label={item.label}
                mt={3}
              />
            ))}
          </Box>
          {children}
        </>
      )}
    </Stack>
  );
};
