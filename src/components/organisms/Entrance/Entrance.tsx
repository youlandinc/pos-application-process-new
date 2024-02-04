import { FC, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_ENTRANCE,
  userpool,
} from '@/constants';
import { HttpError, LoginType, UserType } from '@/types';
import { DetectActiveService } from '@/services/DetectActive';

import { _fetchUserInfoByToken } from '@/requests';

import {
  StyledButton,
  StyledFormItem,
  StyledSelectOption,
} from '@/components/atoms';

import { POSHeader } from '@/components/molecules/POSLayout/components/POSHeader';

export const Entrance: FC = observer(() => {
  const router = useRouter();

  const store = useMst();
  const { detectUserActiveService } = store;

  const [url, setUrl] = useState<string>('');

  useAsync(async () => {
    if (!router.query.token) {
      return;
    }
    try {
      const { data } = await _fetchUserInfoByToken({
        token: router.query.token as string,
      });

      userpool.setLastAuthUserBase(data);
      detectUserActiveService.setDetectUserActiveService(
        new DetectActiveService(data),
      );

      store.injectCognitoUserProfile(data);
      store.injectCognitoUserSession(data);
      const {
        userProfile: { userType, loginType },
      } = data;
      store.updateUserType(userType as UserType);
      store.updateLoginType(loginType as LoginType);
      if (router.query.processId && router.query.taskId) {
        await router.push({
          pathname: '/dashboard/tasks/documents/',
          query: {
            processId: router.query.processId,
            taskId: router.query.taskId,
          },
        });
        return;
      }
      enqueueSnackbar('login success!', {
        autoHideDuration: AUTO_HIDE_DURATION,
        variant: 'success',
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [router.query.token]);

  return (
    <Box sx={{ bgcolor: '#FFFFFF' }}>
      <POSHeader scene={'application'} store={store} />

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
            py={'clamp(40px,6.4vw,80px) '}
            width={{ xxl: 1440, xl: 1240, lg: 938, xs: '100%' }}
          >
            <StyledFormItem
              alignItems={'center'}
              gap={3}
              label={'Which product are you interested in?'}
              labelSx={{ m: 0, fontSize: { md: 36, xs: 24 } }}
            >
              <StyledSelectOption
                onChange={(value) => setUrl(value as string)}
                options={OPTIONS_COMMON_ENTRANCE}
                value={url}
              />
              <StyledButton
                disabled={!url}
                onClick={async () => {
                  store.resetApplicationForm();
                  await router.push(url, url, { shallow: true });
                }}
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  mt: 7,
                }}
              >
                Next
              </StyledButton>
            </StyledFormItem>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
});
