import { FC, FormEventHandler, useCallback, useMemo, useState } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { LoginProps, LoginStyles } from './index';
import { POSFlex } from '@/styles';
import { AUTO_HIDE_DURATION, LOGIN_APP_KEY, userpool } from '@/constants';
import { DetectActiveService } from '@/services/DetectActive';
import { HttpError, LoginType, UserType } from '@/types';
import { User } from '@/types/user';
import { _userSingIn } from '@/requests';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import { useSessionStorageState } from '@/hooks';

import LOG_IN_SVG from '@/svg/auth/log_in.svg';

export const Login: FC<LoginProps> = observer(
  ({ to, successCb, isNestForm = false }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { saasState } = useSessionStorageState('tenantConfig');
    const store = useMst();
    const { detectUserActiveService } = store;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const isDisabled = useMemo(() => {
      return !email || !password;
    }, [email, password]);

    const handledLoginSuccess = useCallback(
      (profile: User.UserSignInRequest) => {
        successCb && successCb();
        if (!profile) {
          return;
        }
        store.injectCognitoUserProfile(profile);
        store.injectCognitoUserSession(profile);
        const {
          userProfile: { userType, loginType },
        } = profile;
        store.updateUserType(userType as UserType);
        store.updateLoginType(loginType as LoginType);
        const { asPath } = router;
        if (asPath.includes('processId')) {
          setLoading(false);
          return router.push(asPath);
        }
        if (to) {
          setLoading(false);
          return router.push(to);
        }
      },
      [router, store, successCb, to],
    );

    const handledLogin = useCallback<FormEventHandler>(
      async (e) => {
        e.preventDefault();

        setLoading(true);
        const params = {
          appkey: LOGIN_APP_KEY,
          loginType: LoginType.YLACCOUNT_LOGIN,
          emailParam: {
            account: email,
            password: userpool.encode(password),
          },
        };

        try {
          const { data } = await _userSingIn(params);
          userpool.setLastAuthUserBase(data);
          detectUserActiveService.setDetectUserActiveService(
            new DetectActiveService(data),
          );
          await handledLoginSuccess(data);
        } catch (err) {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
            persist: true,
          });
        } finally {
          setLoading(false);
        }
      },
      [
        detectUserActiveService,
        email,
        enqueueSnackbar,
        handledLoginSuccess,
        password,
      ],
    );

    const FormBody = useMemo(() => {
      return (
        <Box
          className="form_body"
          component={'form'}
          onSubmit={handledLogin}
          sx={isNestForm ? LoginStyles.form : {}}
        >
          <StyledTextField
            disabled={loading}
            inputProps={{
              autoComplete: 'new-password',
            }}
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            required
            value={email}
          />
          <StyledTextFieldPassword
            disabled={loading}
            inputProps={{
              autoComplete: 'new-password',
            }}
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Password'}
            required
            value={password}
          />
          <StyledButton
            color="primary"
            disabled={isDisabled || loading}
            type={'submit'}
            variant="contained"
          >
            Continue
          </StyledButton>
        </Box>
      );
    }, [email, handledLogin, isDisabled, isNestForm, loading, password]);

    return (
      <>
        {isNestForm ? (
          FormBody
        ) : (
          <StyledBoxWrap
            sx={{
              ...POSFlex('center', 'center', 'column'),
              minHeight: '100vh',
            }}
          >
            <Box sx={LoginStyles.login}>
              <Icon
                component={LOG_IN_SVG}
                sx={{
                  flex: 1,
                  width: '100%',
                  height: 'auto',
                  display: { xs: 'none', lg: 'block' },
                  '& .log_in_svg__pos_svg_theme_color': {
                    fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                  },
                }}
              />

              <Box className="sign_in_form">
                <Typography className="form_title" variant="h3">
                  Welcome to {saasState?.organizationName || 'YouLand'}!
                </Typography>
                {FormBody}
                <Box className="form_foot">
                  <Typography variant="body2">
                    Don&apos;t have an account?
                    <Typography
                      color={'primary'}
                      component={'span'}
                      fontWeight={600}
                      variant={'body2'}
                    >
                      <Link href={'./sign_up/'}> Sign up</Link>
                    </Typography>
                  </Typography>
                  <Typography
                    color={'primary'}
                    fontWeight={600}
                    variant="body2"
                  >
                    <Link href={'./forgot_password/'}>Forgot password?</Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </StyledBoxWrap>
        )}
      </>
    );
  },
);
