import { FC } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { IDashboardInfo } from '@/models/base';

import { OPTIONS_COMMON_STATE } from '@/constants';
import { POSFlex } from '@/styles';

interface DashboardSideInfoBoxProps {
  info: IDashboardInfo;
  loading?: boolean;
}

export const DashboardSideInfoBox: FC<DashboardSideInfoBoxProps> = observer(
  ({ info, loading }) => {
    return (
      <Box
        sx={{
          mt: 3,
          borderRadius: 2,
          p: 3,
          bgcolor: 'primary.lightest',
          minHeight: 100,
          width: 240,
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
              {info?.loanType}
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
              {info?.propertyAddress && (
                <Box
                  color={'text.primary'}
                  component={'li'}
                  display={'flex'}
                  fontSize={14}
                  lineHeight={1.5}
                  width={'100%'}
                >
                  {info?.propertyAddress.formatAddress ? (
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
                      >{`${info?.propertyAddress.formatAddress} ${
                        info?.propertyAddress.aptNumber &&
                        `, #${info?.propertyAddress.aptNumber}`
                      }`}</Box>
                      <Box>{`${
                        info?.propertyAddress.city &&
                        `${info?.propertyAddress.city}, `
                      } ${info?.propertyAddress.state} ${info?.propertyAddress
                        .postcode}`}</Box>
                    </Box>
                  ) : (
                    OPTIONS_COMMON_STATE.find(
                      (item) =>
                        item.value ===
                        (info?.propertyAddress && info?.propertyAddress.state),
                    )?.label || ''
                  )}
                </Box>
              )}
              {/*{borrowerSummaryData?.occupancyType && (*/}
              {/*  <Box*/}
              {/*    color={'text.primary'}*/}
              {/*    component={'li'}*/}
              {/*    display={'flex'}*/}
              {/*    fontSize={14}*/}
              {/*    lineHeight={1.5}*/}
              {/*    width={'100%'}*/}
              {/*  >*/}
              {/*    {borrowerSummaryData.occupancyType}*/}
              {/*  </Box>*/}
              {/*)}*/}
              {/*{borrowerSummaryData?.propertyType && (*/}
              {/*  <Box*/}
              {/*    color={'text.primary'}*/}
              {/*    component={'li'}*/}
              {/*    display={'flex'}*/}
              {/*    fontSize={14}*/}
              {/*    lineHeight={1.5}*/}
              {/*    width={'100%'}*/}
              {/*  >*/}
              {/*    {borrowerSummaryData.propertyType}*/}
              {/*  </Box>*/}
              {/*)}*/}
            </Box>
          </>
        )}
      </Box>
    );
  },
);
