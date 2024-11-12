import { FC, useEffect, useState } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { IDashboardInfo } from '@/models/base';

import { OPTIONS_COMMON_STATE } from '@/constants';

interface DashboardSideInfoBoxProps {
  info: IDashboardInfo;
  loading?: boolean;
}

export const DashboardSideInfoBox: FC<DashboardSideInfoBoxProps> = observer(
  ({ info, loading }) => {
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
      info?.propertyAddress && setFirstRender(false);
    }, [info?.propertyAddress]);

    return (
      <Stack flexShrink={0} height={40} width={'fit-content'}>
        {loading || firstRender ? (
          <Stack alignItems={'flex-end'} width={320}>
            <Skeleton animation={'wave'} height={18} width={'100%'} />
            <Skeleton animation={'wave'} height={18} width={200} />
          </Stack>
        ) : (
          <>
            <Typography
              color={'text.primary'}
              textAlign={{ xs: 'left', lg: 'right' }}
              variant={'body2'}
            >
              {info?.propertyAddress &&
                (info?.propertyAddress.formatAddress
                  ? `${
                      info.propertyAddress?.formatAddress
                        ? `${info.propertyAddress?.formatAddress}, `
                        : ''
                    }${
                      info.propertyAddress?.aptNumber
                        ? `${info.propertyAddress?.aptNumber}, `
                        : ''
                    } ${
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
                    }`
                  : OPTIONS_COMMON_STATE.find(
                      (item) =>
                        item.value ===
                        (info?.propertyAddress && info?.propertyAddress.state),
                    )?.label || '')}
            </Typography>

            <Typography
              color={'text.secondary'}
              fontSize={14}
              textAlign={{ xs: 'left', lg: 'right' }}
            >
              Loan number: {info?.loanNumber}
            </Typography>
          </>
        )}
      </Stack>
    );
  },
);
