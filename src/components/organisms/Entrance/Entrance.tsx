import { POSFont } from '@/styles';
import { useMemo } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { UserType } from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledHeaderLogo,
} from '@/components/atoms';

const productList = [
  // {
  //   name: 'Mortgage',
  //   url: '/application/mortgage',
  //   disabled: false,
  // },
  //{ name: 'Alternative mortgage', url: '/application/alternative_mortgage' },
  //{ name: 'Rental', url: '/application/rental' },
  {
    name: 'Bridge/Fix and Flip',
    url: '/application/bridge',
    disabled: false,
  },
  //{ name: 'Jumbo', url: '/application/jumbo' },
  //{ name: 'Crypto mortgage', url: '/application/crypto_mortgage' },
  //{ name: 'Crypto loan', url: '/application/crypto_loan' },
];

export const Entrance = observer(() => {
  const { userType } = useMst();

  const computedArray = useMemo(() => {
    if (userType === UserType.BROKER) {
      productList.forEach((item) => {
        if (item.name !== 'Bridge/Fix and Flip') {
          item.disabled = true;
        }
      });
    }
    return productList;
  }, [userType]);

  return (
    <Box sx={{ bgcolor: '#F5F8FA' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          '& .entrance_header_inside': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            height: 92,
            width: {
              xxl: 1440,
              xl: 1240,
              lg: 938,
              xs: '100%',
            },
            px: {
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            },
          },
        }}
      >
        <Box className={'entrance_header_inside'}>
          <StyledHeaderLogo />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 92px)',
            width: {
              xxl: 1440,
              xl: 1240,
              lg: 938,
              xs: '100%',
            },
            py: 'clamp(40px,7vw,80px) ',
            px: {
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            },
          }}
        >
          <StyledFormItem
            alignItems={'center'}
            gap={3}
            label={'Which product are you interested in?'}
            labelSx={{ m: 0 }}
          >
            {computedArray.map((item, index) => {
              return (
                <StyledButton
                  color={'info'}
                  key={item.name + index}
                  onClick={() => (window.location.href = item.url)}
                  sx={{
                    width: { md: 600, xs: '100%' },
                    height: 64,
                    ...POSFont(20, 600, 1.5, 'text.primary'),
                    fontSize: '20px !important',
                  }}
                  variant={'outlined'}
                >
                  {item.name}
                </StyledButton>
              );
            })}
          </StyledFormItem>
        </Box>
      </Box>
    </Box>
  );
});
