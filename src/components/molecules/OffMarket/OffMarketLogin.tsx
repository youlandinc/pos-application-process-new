import {
  StyledBoxWrap,
  StyledButton,
  StyledHeaderLogo,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';
import { LoginProps, LoginStyles } from '@/components/molecules/Auth/Login';
import { AUTO_HIDE_DURATION, LOGIN_APP_KEY, userpool } from '@/constants';
import { useMst } from '@/models/Root';
import { _userSingIn } from '@/requests';
import { DetectActiveService } from '@/services/DetectActive';
import { HttpError, LoginType, UserType } from '@/types';
import { User } from '@/types/user';
import { Box, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FormEventHandler, useCallback, useMemo, useState } from 'react';

export const OffMarketLogin = observer<LoginProps>(
  ({ to, successCb, isNestForm = false }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const store = useMst();
    const { detectUserActiveService } = store;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

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
        if (profile.forceChangePassword) {
          return router.push({
            pathname: '/auth/reset-password/',
            query: router.query,
          });
        }
        const { asPath } = router;
        if (asPath.includes('loanId') && !asPath.includes('type')) {
          setLoading(false);
          if (asPath.includes('/auth/login/?loanId=')) {
            return router.push({
              pathname: '/',
              query: {
                ...router.query,
                loanId: router.query.loanId,
              },
            });
          }
          return router.push(asPath);
        }
        if (to) {
          setLoading(false);
          return router.push({ pathname: to, query: router.query });
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
            autoFocus
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              autoComplete: 'email',
              name: 'email',
            }}
            label={'Email'}
            name={'email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            required
            value={email}
          />
          <StyledTextFieldPassword
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              autoComplete: 'current-password',
              name: 'password',
            }}
            label={'Password'}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Password'}
            required
            value={password}
          />
          <StyledButton
            color="primary"
            disabled={loading}
            type={'submit'}
            variant="contained"
          >
            Continue
          </StyledButton>
        </Box>
      );
    }, [email, handledLogin, isNestForm, loading, password]);

    return (
      <>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={92}
          m={'0 auto'}
          px={{
            lg: 0,
            xs: 'clamp(24px,6.4vw,80px)',
          }}
          width={{
            xxl: 1440,
            xl: 1240,
            lg: 938,
            xs: '100%',
          }}
        >
          <StyledHeaderLogo />
        </Stack>
        <StyledBoxWrap
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 92px)',
          }}
        >
          <Box sx={LoginStyles.login}>
            <Box className="sign_in_form">
              <Typography className="form_title" variant="h3">
                Sign in to view market deals
              </Typography>
              {FormBody}
              <Box className="form_foot">
                <Typography variant="body2">
                  Don&apos;t have an account?{' '}
                  <Typography
                    component={'span'}
                    onClick={async () => {
                      await router.push('/off-market/sign-up/');
                    }}
                    sx={{
                      cursor: 'pointer',
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Sign up
                  </Typography>
                </Typography>
                <Typography
                  onClick={async () => {
                    await router.push('/off-market/forgot-password/');
                  }}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>
            </Box>
          </Box>
        </StyledBoxWrap>
      </>
    );
  },
);
