import { FC, useMemo } from 'react';
import { Box, Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFont } from '@/styles';
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

export const Entrance: FC = observer(() => {
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
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'center'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={92}
          justifyContent={'flex-start'}
          px={{ lg: 0, xs: 'clamp(24px,6.4vw,80px)' }}
          width={{ xxl: 1440, xl: 1240, lg: 938, xs: '100%' }}
        >
          <StyledHeaderLogo />
        </Stack>
      </Stack>

      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'center'}
        width={'100%'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'column'}
          justifyContent={'flex-start'}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'column'}
            justifyContent={'flex-start'}
            minHeight={'calc(100vh - 92px)'}
            px={{ lg: 0, xs: 'clamp(24px,6.4vw,80px)' }}
            py={'clamp(40px,7vw,80px) '}
            width={{ xxl: 1440, xl: 1240, lg: 938, xs: '100%' }}
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
                      ...POSFont('20px !important', 600, 1.5, 'text.primary'),
                      width: { md: 600, xs: '100%' },
                      height: 64,
                    }}
                    variant={'outlined'}
                  >
                    {item.name}
                  </StyledButton>
                );
              })}
            </StyledFormItem>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
});
