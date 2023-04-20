import { SignUpSchema } from '@/constants/schema/sign_up';
import { useSwitch } from '@/hooks';
import { _userSingUp } from '@/requests';
import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { Box, Icon, Typography } from '@mui/material';

import { UserType } from '@/types';
import { validate } from 'validate.js';

import { SignUpStyles } from './index';
import {
  StyledButton,
  StyledDialog,
  StyledSelect,
  StyledTextField,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';
import {
  AUTO_HIDE_DURATION,
  LOGIN_APP_KEY,
  OPTIONS_COMMON_USER_TYPE,
  userpool,
} from '@/constants';

import SignUpSvg from '../../../../../public/sign_up.svg';

export const SignUp: FC = () => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [userType, setUserType] = useState<keyof typeof UserType>();
  const [formError, setFormError] = useState<
    Partial<Record<keyof typeof SignUpSchema, string[]>> | undefined
  >();

  const [passwordError, setPasswordError] = useState<{
    lengthError: boolean;
    letterError: boolean;
    numberError: boolean;
    noSpaceError: boolean;
  }>({
    lengthError: false,
    letterError: false,
    numberError: false,
    noSpaceError: false,
  });

  const { open, close, visible } = useSwitch(true);

  const handledPasswordChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setPassword(e.target.value);
      const lengthError = e.target.value?.length >= 8;
      const noSpaceError = e.target.value.indexOf(' ') <= 0;
      const numberError = !!e.target.value.match(/\d/g);
      const letterError = !!e.target.value.match(/[a-zA-Z]/g);
      setPasswordError({
        lengthError,
        noSpaceError,
        letterError,
        numberError,
      });
    }, []);

  const handledSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();
      const errors = validate(
        { userType, email, password, confirmedPassword },
        SignUpSchema,
      );
      setFormError(errors);

      if (errors) {
        return;
      }

      const data = {
        appkey: LOGIN_APP_KEY,
        emailParam: {
          email,
          password: userpool.encode(password),
          userType: userType as UserType,
        },
      };
      try {
        await _userSingUp(data);
        open();
      } catch (err) {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      } finally {
        close();
      }
    },
    [
      close,
      confirmedPassword,
      email,
      enqueueSnackbar,
      open,
      password,
      userType,
    ],
  );

  return (
    <Box sx={SignUpStyles}>
      <Icon className="sign_up_img" component={SignUpSvg} />
      <Box className="sign_up_form">
        <Typography className="form_title" variant="h3">
          sign up
        </Typography>

        <Box className="form_body" component={'form'} onSubmit={handledSubmit}>
          <StyledSelect
            label={'Select Role'}
            onChange={(e) =>
              setUserType(e.target.value as keyof typeof UserType)
            }
            options={OPTIONS_COMMON_USER_TYPE}
            required
            validate={formError?.userType}
            value={userType}
          />

          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            required
            validate={formError?.email}
            value={email}
          />
          <Box>
            <StyledTextFieldPassword
              error={
                Object.values(passwordError).filter((item) => item).length > 0
              }
              label={'Password'}
              onChange={handledPasswordChange}
              placeholder={'Password'}
              required
              value={password}
            />
            <Transitions>
              {password && (
                <Box className={'password_error_list'} component={'ul'}>
                  <Box
                    className={!passwordError.lengthError ? 'error_active' : ''}
                    component={'li'}
                  >
                    8 characters minimum
                  </Box>
                  <Box
                    className={
                      !passwordError.noSpaceError ? 'error_active' : ''
                    }
                    component={'li'}
                  >
                    Cannot contain spaces
                  </Box>
                  <Box
                    className={!passwordError.letterError ? 'error_active' : ''}
                    component={'li'}
                  >
                    At least one letter
                  </Box>
                  <Box
                    className={!passwordError.numberError ? 'error_active' : ''}
                    component={'li'}
                  >
                    At least one number
                  </Box>
                </Box>
              )}
            </Transitions>
          </Box>
          <StyledTextFieldPassword
            label={'Confirmed Password'}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder={'Confirmed Password'}
            required
            validate={formError?.confirmedPassword}
            value={confirmedPassword}
          />
          <StyledButton color="primary" type={'submit'} variant="contained">
            Create account
          </StyledButton>
        </Box>

        <Box className="form_foot">
          <Typography variant="body2">
            Already have an account?
            <Link className="link_style" href={'/auth/login/'}>
              {' '}
              Sign in
            </Link>
          </Typography>
          <Typography sx={{ color: 'info.main', mt: 3 }} variant="body2">
            By signing up, you agree to our{' '}
            <Link
              className="link_style"
              href={'https://www.youland.com/legal/terms/'}
              target="_blank"
            >
              {' '}
              Term of Use{' '}
            </Link>
            and to receive YouLand emails & updates and acknowledge that you
            read our{' '}
            <Link
              className="link_style"
              href={'https://www.youland.com/legal/privacy/'}
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
