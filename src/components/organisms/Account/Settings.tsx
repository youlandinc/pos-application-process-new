import { FC, useMemo, useReducer, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints } from '@/hooks';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, userpool } from '@/constants';

import { StyledLoading, StyledTab } from '@/components/atoms';
import {
  PaymentLinkDomain,
  PaymentLinkEmail,
  PaymentLinkLogo,
  QualificationList,
  SettingsChangeAvatar,
  SettingsChangePassword,
  SettingsChangeProfile,
} from '@/components/molecules';

import {
  AccountRoleTaskHash,
  AccountUserProfileParams,
  HttpError,
  UserType,
} from '@/types';
import { _fetchUerInfoWrapper } from '@/requests';
import { POSGetParamsFromUrl } from '@/utils';

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
  companyName: '',
};

interface LinkData {
  domain: any[];
  emailDomain: any[];
  logoUrl: string;
}

export const AccountSettings: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

  const [store, dispatch] = useReducer(AccountReducer, initialState);
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [link, setLink] = useState<LinkData>({
    domain: [],
    emailDomain: [],
    logoUrl: '',
  });
  const [accountType, setAccountType] = useState<UserType>(UserType.CUSTOMER);

  const [taskHash, setTaskHash] = useState<AccountRoleTaskHash | undefined>();

  const { loading } = useAsync(async () => {
    // Fetch user settings
    try {
      const {
        data: {
          info,
          link,
          settings: {
            accountType,
            userInfo: {
              avatar,
              backgroundColor,
              firstName,
              lastName,
              birthDay,
              email,
              phone,
              companyName,
            },
          },
        },
      } = await _fetchUerInfoWrapper();

      dispatch({
        type: 'init',
        payload: {
          avatar: avatar || '',
          firstName: firstName || '',
          lastName: lastName || '',
          birthDay: birthDay ? new Date(birthDay) : null,
          email: email || '',
          phone: phone || '',
          companyName: companyName || '',
        },
      });

      setAccountType(accountType);

      const lastAuthId = userpool.getLastAuthUserId();

      userpool.setLastAuthUserInfo(lastAuthId, 'avatar', avatar ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName ?? '');
      userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName ?? '');
      userpool.setLastAuthUserInfo(
        lastAuthId,
        'background',
        backgroundColor ?? '',
      );

      setBackgroundColor(backgroundColor || '');

      setTaskHash(
        Object.keys(info?.tasks).length !== 0 ? info?.tasks : undefined,
      );

      setLink(link);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [dispatch]);

  const computedLabel = useMemo(() => {
    switch (userType) {
      case UserType.REAL_ESTATE_AGENT:
        return 'Real estate agent info';
      case UserType.BROKER:
        return 'Broker info';
      case UserType.LOAN_OFFICER:
        return 'Loan officer info';
      case UserType.CUSTOMER:
      default:
        return '';
    }
  }, [userType]);

  const startIndex = () => {
    const { tab } = POSGetParamsFromUrl(location.href);
    return tab ? parseInt(tab) : 0;
  };

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
            cb={async (index) => {
              await router.push({ query: { tab: index } });
            }}
            startIndex={startIndex()}
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
            tabsData={
              taskHash
                ? [
                    {
                      label: 'Settings',
                      content: (
                        <Stack gap={{ xs: 3, md: 6 }} mt={3}>
                          <SettingsChangeAvatar
                            backgroundColor={backgroundColor || ''}
                            dispatch={dispatch}
                            store={store}
                          />
                          <SettingsChangeProfile
                            accountType={accountType}
                            dispatch={dispatch}
                            store={store}
                          />
                          <SettingsChangePassword />
                        </Stack>
                      ),
                    },
                    {
                      label: computedLabel,
                      content: <QualificationList taskHash={taskHash!} />,
                    },
                    {
                      label: 'Custom payment link',
                      content: (
                        <Stack gap={{ xs: 3, md: 6 }} mt={3}>
                          <PaymentLinkLogo imgSrc={link.logoUrl} />
                          <PaymentLinkDomain data={link.domain} />
                          <PaymentLinkEmail data={link.emailDomain} />
                        </Stack>
                      ),
                    },
                  ]
                : [
                    {
                      label: 'Settings',
                      content: (
                        <Stack gap={{ xs: 3, md: 6 }} mt={3}>
                          <SettingsChangeAvatar
                            backgroundColor={backgroundColor || ''}
                            dispatch={dispatch}
                            store={store}
                          />
                          <SettingsChangeProfile
                            accountType={accountType}
                            dispatch={dispatch}
                            store={store}
                          />
                          <SettingsChangePassword />
                        </Stack>
                      ),
                    },
                  ]
            }
          />
        </Stack>
      </Stack>
    </Fade>
  );
};
