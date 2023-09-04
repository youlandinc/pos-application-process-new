import { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { ISelectedProcessData } from '@/models/base';

import { OPTIONS_COMMON_STATE, OPTIONS_MORTGAGE_PROPERTY } from '@/constants';
import { POSFlex } from '@/styles';
import { VariableName } from '@/types';
import { POSFindLabel, POSFindSpecificVariable } from '@/utils';

interface DashboardSideInfoBoxProps {
  info: ISelectedProcessData;
  loading?: boolean;
}

interface IBorrowerSummaryData {
  productType: string;
  address: string | ReactNode;
  occupancyType?: string;
  propertyType: string;
}

export const DashboardSideInfoBox: FC<DashboardSideInfoBoxProps> = observer(
  ({ info, loading }) => {
    const { data } = info;

    const [borrowerSummaryData, setBorrowerSummaryData] =
      useState<IBorrowerSummaryData>();

    useEffect(() => {
      if (data) {
        const {
          extra: { variables },
        } = data;

        const startingData = POSFindSpecificVariable(
          VariableName.starting,
          variables,
        );

        if (!startingData) {
          return;
        }

        const {
          value: { propAddr: address, propertyType, propertyUnit },
        } = startingData;

        const propertyInfo =
          propertyUnit > 0
            ? `${propertyUnit} units`
            : POSFindLabel(OPTIONS_MORTGAGE_PROPERTY, propertyType);

        setBorrowerSummaryData({
          productType: data.extra.name,
          address:
            address && address.address ? (
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
                >{`${address.address} ${
                  address.aptNumber && `, #${address.aptNumber}`
                }`}</Box>
                <Box>{`${address.city && `${address.city}, `} ${
                  address.state
                } ${address.postcode}`}</Box>
              </Box>
            ) : (
              OPTIONS_COMMON_STATE.find(
                (item) => item.value === (address && address.state),
              )?.label || ''
            ),
          propertyType: propertyInfo,
        });
      }
    }, [data]);

    return (
      <Box
        sx={{
          mt: 3,
          maxWidth: 280,
          borderRadius: 2,
          p: 3,
          bgcolor: 'action.hover',
          minHeight: 100,
        }}
      >
        {loading ? (
          <Stack gap={1}>
            <Skeleton animation={'wave'} height={24} variant="rounded" />
            <Skeleton animation={'wave'} height={36} variant="rounded" />
            <Skeleton animation={'wave'} height={18} variant="rounded" />
          </Stack>
        ) : (
          <>
            <Typography mb={1} variant={'subtitle1'}>
              {borrowerSummaryData?.productType}
            </Typography>
            <Box
              className={'customInfo_list'}
              component={'ul'}
              sx={{
                width: '100%',
                p: 0,
                listStyle: 'none',
              }}
            >
              {borrowerSummaryData?.address && (
                <Box
                  color={'text.primary'}
                  component={'li'}
                  display={'flex'}
                  fontSize={14}
                  lineHeight={1.5}
                  width={'100%'}
                >
                  {borrowerSummaryData.address}
                </Box>
              )}
              {borrowerSummaryData?.occupancyType && (
                <Box
                  color={'text.primary'}
                  component={'li'}
                  display={'flex'}
                  fontSize={14}
                  lineHeight={1.5}
                  width={'100%'}
                >
                  {borrowerSummaryData.occupancyType}
                </Box>
              )}
              {borrowerSummaryData?.propertyType && (
                <Box
                  color={'text.primary'}
                  component={'li'}
                  display={'flex'}
                  fontSize={14}
                  lineHeight={1.5}
                  width={'100%'}
                >
                  {borrowerSummaryData.propertyType}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    );
  },
);
