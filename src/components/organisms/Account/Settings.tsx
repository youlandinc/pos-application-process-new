import { FC } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { useBreakpoints } from '@/hooks';

import { useMst } from '@/models/Root';

import { StyledLoading, StyledTab } from '@/components/atoms';
import { _fetchUserInfo } from '@/requests';
import {
  SettingsChangeAvatar,
  SettingsChangePassword,
  SettingsChangeProfile,
} from '@/components/molecules';

export const AccountSettings: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const { userType } = useMst();

  const { loading } = useAsync(async () => {
    // Fetch user settings
    const res = await _fetchUserInfo();
    console.log(res);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(1);
    //   }, 1000);
    // });
  }, []);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Account
        </Typography>

        <Stack maxWidth={'100%'} width={'100%'}>
          <StyledTab
            startIndex={0}
            sx={{
              '& .MuiTabs-flexContainer .MuiButtonBase-root': {
                p: 0,
                minWidth: 0,
                minHeight: 0,
                mr: 3,
                mb: 1.25,
                fontWeight: 600,
              },
            }}
            tabsData={[
              {
                label: 'Settings',
                content: (
                  <Stack gap={6}>
                    <SettingsChangeAvatar />
                    <SettingsChangeProfile />
                    <SettingsChangePassword />
                  </Stack>
                ),
              },
              {
                label: `${
                  userType!.toLowerCase().charAt(0).toUpperCase() +
                  userType!.toLowerCase().slice(1)
                } info`,
                content: <Stack>123</Stack>,
              },
            ]}
          />
        </Stack>
      </Stack>
    </Fade>
  );
};
