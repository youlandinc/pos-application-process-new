import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { _userSendCode, _userSingUp, _userVerifyCode } from '@/requests';
import { BizType, UserType } from '@/types';
import { useSwitch } from '@/hooks';
import { SignUpStyles } from './index';
import {
  AUTO_HIDE_DURATION,
  LOGIN_APP_KEY,
  OPTIONS_COMMON_USER_TYPE,
  SignUpSchema,
  userpool,
} from '@/constants';

import {
  StyledButton,
  StyledDialog,
  StyledSelect,
  StyledTextField,
  StyledTextFieldOtp,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import SIGN_UP_SVG from '@/svg/auth/sign_up.svg';

export const SignUp: FC = () => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [userType, setUserType] = useState<keyof typeof UserType>();
  const [otp, setOtp] = useState('');
  const [target, setTarget] = useState<'_top' | '_blank'>('_top');
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

  const { open, close, visible } = useSwitch(false);

  useEffect(() => {
    setTarget('_blank');
  }, []);

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
      }
    },
    [confirmedPassword, email, enqueueSnackbar, open, password, userType],
  );

  const handledResendOtp = useCallback(async () => {
    const data = {
      bizType: BizType.REGISTER,
      appkey: LOGIN_APP_KEY,
      email,
    };
    await _userSendCode(data);
  }, [email]);

  const handledVerifyOtp = useCallback(async () => {
    const data = {
      appkey: LOGIN_APP_KEY,
      code: otp,
      email,
      bizType: BizType.REGISTER,
    };
    try {
      await _userVerifyCode(data);
      await router.push('./login');
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  }, [email, enqueueSnackbar, otp, router]);

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !email || !password || !confirmedPassword || !userType;
  }, [confirmedPassword, email, password, passwordError, userType]);

  return (
    <Box sx={SignUpStyles}>
      <Icon className="sign_up_img" component={SIGN_UP_SVG} />
      <Box className="sign_up_form">
        <Typography className="form_title" variant="h3">
          Sign Up
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
                password
                  ? Object.values(passwordError).filter((item) => !item)
                      .length > 0
                  : false
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
          <StyledButton
            color="primary"
            disabled={isDisabled}
            type={'submit'}
            variant="contained"
          >
            Create Account
          </StyledButton>
        </Box>

        <Box className="form_foot">
          <Typography variant="body2">
            Already have an account?
            <Link className="link_style" href={'/auth/login/'}>
              {' '}
              Log In
            </Link>
          </Typography>
          <Typography sx={{ color: 'info.main', mt: 3 }} variant="body2">
            By signing up, you agree to our{' '}
            <Link
              className="link_style"
              href={'https://www.youland.com/legal/terms/'}
              target={target}
            >
              {' '}
              Term of Use{' '}
            </Link>
            and to receive YouLand emails & updates and acknowledge that you
            read our{' '}
            <Link
              className="link_style"
              href={'https://www.youland.com/legal/privacy/'}
              target={target}
            >
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>
      </Box>
      <StyledDialog
        content={
          <Box>
            <Typography
              className={'POS_tl POS_fullwidth'}
              color={'text.secondary'}
              component={'div'}
              variant={'body2'}
            >
              An email with a verification code has been sent to{' '}
              <Typography component={'span'} variant={'subtitle2'}>
                {email}
              </Typography>
            </Typography>
            <Box className={'POS_flex POS_jc_c POS_al_c'} mt={3}>
              <StyledTextFieldOtp onChange={(v) => setOtp(v)} />
            </Box>
            <Typography
              className={'POS_tc POS_fullwidth'}
              color={'text.secondary'}
              component={'div'}
              mt={3}
              variant={'body2'}
            >
              Didn&apos;t verification code?{' '}
              <Typography
                color={'text.primary'}
                component={'span'}
                onClick={handledResendOtp}
                variant={'body2'}
              >
                Request again
              </Typography>
            </Typography>
          </Box>
        }
        footer={
          <>
            <StyledButton
              onClick={close}
              size={'small'}
              sx={{ mr: 1 }}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'primary'}
              onClick={handledVerifyOtp}
              size={'small'}
            >
              Confirm
            </StyledButton>
          </>
        }
        header={
          <>
            <Typography variant={'h6'}>Thank you for joining us!</Typography>
          </>
        }
        onClose={close}
        open={visible}
      />
    </Box>
  );
};
