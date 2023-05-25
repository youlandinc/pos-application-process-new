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
import { LoginType, UserType } from '@/types';
import { User } from '@/types/user';
import { _userSingIn } from '@/requests';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import LOG_IN_SVG from '@/svg/auth/log_in.svg';

export const Login: FC<LoginProps> = observer(
  ({ to, successCb, isNestForm = false }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

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
          await detectUserActiveService.setDetectUserActiveService(
            new DetectActiveService(data),
          );
          await handledLoginSuccess(data);
        } catch (err) {
          enqueueSnackbar(err as string, {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
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
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            required
            value={email}
          />
          <StyledTextFieldPassword
            disabled={loading}
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
              <Icon className="sign_in_img" component={LOG_IN_SVG} />

              <Box className="sign_in_form">
                <Typography className="form_title" variant="h3">
                  Welcome to YouLand!
                </Typography>
                {FormBody}
                <Box className="form_foot">
                  <Typography variant="body2">
                    Don&apos;t have an account?
                    <Typography
                      color={'primary'}
                      component={'span'}
                      variant={'body2'}
                    >
                      <Link href={'./sign_up/'}> Sign Up</Link>
                    </Typography>
                  </Typography>
                  <Typography color={'primary'} variant="body2">
                    <Link href={'./forgot_password/'}>Forgot Password?</Link>
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
