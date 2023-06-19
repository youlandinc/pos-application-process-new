import { FC, ReactNode } from 'react';
import { Box, BoxProps, Divider, SxProps } from '@mui/material';

import { POSFont } from '@/styles';
import { POSFormatDollar } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import { DashboardProductItem } from '@/components/molecules';

const useStyles: SxProps = {
  '&.card_wrap': {
    width: '100%',

    border: '1px solid',
    borderColor: 'background.border_default',
    p: 3,
    borderRadius: 2,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flex: {
      xl: 1,
      xs: '100%',
    },
    minHeight: 464,
  },
  '& .card_title': {
    ...POSFont({ md: 24, sx: 16 }, 600, 1.5, 'text.primary'),
  },
  '& .card_info': {
    my: 1.5,
  },
} as const;

interface CardProps extends BoxProps {
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

export const Card: FC<CardProps> = ({
  loading,
  title = 'Purchase',
  subTitle = 'Total loan amount',
  subInfo = POSFormatDollar(125000),
  dataList = [{ label: 'Purchase Price', info: POSFormatDollar(125000) }],
  children,
  ...rest
}) => {
  return (
    <Box className={'card_wrap'} sx={useStyles} {...rest}>
      {loading ? (
        <StyledLoading sx={{ mb: 3, color: 'primary.main' }} />
      ) : (
        <>
          <Box className={'card_title'}>
            <Box>{title}</Box>
          </Box>
          <Box className={'card_info'}>
            <DashboardProductItem
              info={
                <Box
                  sx={{
                    ...POSFont({ md: 24, xs: 16 }, 600, 1.5, 'primary.main'),
                  }}
                >
                  {subInfo}
                </Box>
              }
              label={subTitle}
            />
            <Divider sx={{ py: 1 }} />
            {dataList.map((item, index) => (
              <DashboardProductItem
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
    </Box>
  );
};
