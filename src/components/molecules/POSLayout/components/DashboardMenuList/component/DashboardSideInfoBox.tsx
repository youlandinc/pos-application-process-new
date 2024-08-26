import { FC } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { IDashboardInfo } from '@/models/base';

import { OPTIONS_COMMON_STATE } from '@/constants';
import { StyledTooltip } from '@/components/atoms';

interface DashboardSideInfoBoxProps {
  info: IDashboardInfo;
  loading?: boolean;
}

export const DashboardSideInfoBox: FC<DashboardSideInfoBoxProps> = observer(
  ({ info, loading }) => {
    return (
      <Stack
        bgcolor={'primary.lightest'}
        borderRadius={2}
        minHeight={100}
        mt={3}
        p={3}
        width={240}
      >
        {loading ? (
          <Stack gap={1}>
            <Skeleton animation={'wave'} height={24} variant="rounded" />
            <Skeleton animation={'wave'} height={36} variant="rounded" />
            <Skeleton animation={'wave'} height={18} variant="rounded" />
            <Stack bgcolor={'#D2D6E1'} height={'1px'} my={1.5} width={'100%'} />
            <Skeleton animation={'wave'} height={18} variant="rounded" />
          </Stack>
        ) : (
          <>
            <Typography mb={1} variant={'subtitle1'}>
              {info?.loanType}
            </Typography>
            <Stack
              component={'ul'}
              p={0}
              sx={{
                listStyle: 'none',
              }}
              width={'100%'}
            >
              {info?.propertyAddress && (
                <Stack
                  color={'text.primary'}
                  component={'li'}
                  display={'flex'}
                  fontSize={14}
                  lineHeight={1.5}
                  width={'100%'}
                >
                  {info?.propertyAddress.formatAddress ? (
                    <Stack justifyContent={'center'} width={'100%'}>
                      <Box
                        style={{
                          wordBreak: 'break-all',
                          whiteSpace: 'break-spaces',
                          lineHeight: 1.5,
                        }}
                      >
                        {`${
                          info.propertyAddress?.formatAddress
                            ? `${info.propertyAddress?.formatAddress} `
                            : ''
                        }${
                          info.propertyAddress?.aptNumber
                            ? `${info.propertyAddress?.aptNumber}, `
                            : ''
                        }`}
                      </Box>
                      <Box>
                        {`${
                          info.propertyAddress?.city
                            ? `${info.propertyAddress?.city}, `
                            : ''
                        }${
                          info.propertyAddress?.state
                            ? `${info.propertyAddress?.state} `
                            : ''
                        }${
                          info.propertyAddress?.postcode
                            ? `${info.propertyAddress?.postcode}`
                            : ''
                        }`}
                      </Box>
                    </Stack>
                  ) : (
                    OPTIONS_COMMON_STATE.find(
                      (item) =>
                        item.value ===
                        (info?.propertyAddress && info?.propertyAddress.state),
                    )?.label || ''
                  )}
                </Stack>
              )}
            </Stack>

            <Stack bgcolor={'#D2D6E1'} height={'1px'} my={1.5} width={'100%'} />

            <StyledTooltip title={'Loan number'}>
              <Typography
                color={'text.secondary'}
                fontSize={14}
                width={'fit-content'}
              >
                {info?.loanNumber}
              </Typography>
            </StyledTooltip>
          </>
        )}
      </Stack>
    );
  },
);
