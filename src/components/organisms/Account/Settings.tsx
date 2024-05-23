import { FC, useReducer, useState } from 'react';
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
import { AccountUserProfileParams, HttpError } from '@/types';
import { AUTO_HIDE_DURATION, userpool } from '@/constants';
import { useSnackbar } from 'notistack';

const AccountReducer = (
  state: AccountUserProfileParams,
  action: {
    type: string;
    payload: any;
  },
) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'change': {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    }
    default:
      return state;
  }
};

const initialState: AccountUserProfileParams = {
  avatar: '',
  firstName: '',
  lastName: '',
  birthDay: '',
  email: '',
  phone: '',
};

export const AccountSettings: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

  const [store, dispatch] = useReducer(AccountReducer, initialState);
  const [backgroundColor, setBackgroundColor] = useState<string>('');

  const { loading } = useAsync(async () => {
    // Fetch user settings
    try {
      const {
        data: {
          userInfo: {
            avatar,
            backgroundColor,
            firstName,
            lastName,
            birthDay,
            email,
            phone,
          },
        },
      } = await _fetchUserInfo();

      dispatch({
        type: 'init',
        payload: {
          avatar: avatar || '',
          firstName: firstName || '',
          lastName: lastName || '',
          birthDay: birthDay ? new Date(birthDay) : null,
          email: email || '',
          phone: phone || '',
        },
      });

      const lastAuthId = userpool.getLastAuthUserId();

      userpool.setLastAuthUserInfo(lastAuthId, 'avatar', avatar);
      userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName);
      userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName);
      userpool.setLastAuthUserInfo(lastAuthId, 'background', backgroundColor);

      setBackgroundColor(backgroundColor || '');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
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
            startIndex={router.query.qualification ? 1 : 0}
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
                  <Stack gap={{ xs: 3, md: 6 }}>
                    <SettingsChangeAvatar
                      backgroundColor={backgroundColor}
                      dispatch={dispatch}
                      store={store}
                    />
                    <SettingsChangeProfile dispatch={dispatch} store={store} />
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
