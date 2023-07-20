import { FC } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, userpool } from '@/constants';
import { POSFont } from '@/styles';
import { LoginType, UserType } from '@/types';
import { DetectActiveService } from '@/services/DetectActive';

import { _fetchUserInfoByToken } from '@/requests';

import {
  StyledButton,
  StyledFormItem,
  StyledHeaderLogo,
} from '@/components/atoms';
import { useAsync } from 'react-use';

const productList = [
  // {
  //   name: 'Mortgage',
  //   url: '/application/mortgage',
  // },
  //{ name: 'Alternative mortgage', url: '/application/alternative_mortgage' },
  //{ name: 'Rental', url: '/application/rental' },
  {
    name: 'Stabilized Bridge',
    url: '/application/bridge',
  },
  {
    name: 'Fixed & Flip',
    url: '/application/fixed_and_flip',
  },
  {
    name: 'Ground-up Construction',
    url: '/application/ground_up_construction',
  },
  //{ name: 'Jumbo', url: '/application/jumbo' },
  //{ name: 'Crypto mortgage', url: '/application/crypto_mortgage' },
  //{ name: 'Crypto loan', url: '/application/crypto_loan' },
];

export const Entrance: FC = observer(() => {
  const router = useRouter();

  const store = useMst();
  const { detectUserActiveService } = store;

  const { loading } = useAsync(async () => {
    if (!router.query.token) {
      return;
    }
    try {
      const { data } = await _fetchUserInfoByToken({
        token: router.query.token as string,
      });

      userpool.setLastAuthUserBase(data);
      await detectUserActiveService.setDetectUserActiveService(
        new DetectActiveService(data),
      );

      store.injectCognitoUserProfile(data);
      store.injectCognitoUserSession(data);
      const {
        userProfile: { userType, loginType },
      } = data;
      store.updateUserType(userType as UserType);
      store.updateLoginType(loginType as LoginType);
      enqueueSnackbar('login success!', {
        autoHideDuration: AUTO_HIDE_DURATION,
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar(e as string, {
        autoHideDuration: AUTO_HIDE_DURATION,
        variant: 'error',
      });
    }
  }, [router.query.token]);

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
          <StyledHeaderLogo disabled={loading} />
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
              {productList.map((item, index) => {
                return (
                  <StyledButton
                    color={'info'}
                    disabled={loading}
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
