import { FC, ReactNode, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { POSFlex } from '@/styles';
import { POSFindLabel } from '@/utils';
import { ParseProcess } from '@/services/ParseProcess';
import { ISelectedProcessData } from '@/models/base';

import {
  OPTIONS_COMMON_STATE,
  OPTIONS_MORTGAGE_OCCUPANCY,
  OPTIONS_MORTGAGE_PROPERTY,
} from '@/constants';

interface DashboardSideInfoBoxProps {
  info: ISelectedProcessData;
}

interface IBorrowerSummaryData {
  productType: string;
  address: string | ReactNode;
  occupancyType: string;
  propertyType: string;
}

export const DashboardSideInfoBox: FC<DashboardSideInfoBoxProps> = observer(
  ({ info }) => {
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
          <Box
            sx={{
              mt: 3,
              maxWidth: 280,
              borderRadius: 2,
              p: 3,
              bgcolor: 'action.hover',
            }}
          >
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
          </Box>
        )}
      </>
    );
  },
);
