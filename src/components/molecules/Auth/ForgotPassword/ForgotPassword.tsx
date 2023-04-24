import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Typography } from '@mui/material';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { ForgotPasswordProps, ForgotPasswordStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import FORGOT_PASSWORD_SVG from '@/svg/auth/forgot_password.svg';
import {
  AUTO_HIDE_DURATION,
  ForgotPasswordSchema,
  LOGIN_APP_KEY,
  userpool,
} from '@/constants';
import { useBreakpoints } from '@/hooks';
import { BizType } from '@/types';
import { _userResetPassword, _userSendCode } from '@/requests';

export const ForgotPassword: FC<ForgotPasswordProps> = ({
  isNestForm = false,
  successCb,
  isRedirect = true,
}) => {
  const breakpoint = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  console.log(breakpoint);

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [seconds, setSeconds] = useState(60);
  const [formError, setFormError] = useState<
    Partial<Record<keyof typeof ForgotPasswordSchema, string[]>> | undefined
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

  const onSendCodeClick = useCallback(async () => {
    const errors = validate({ email }, ForgotPasswordSchema);
    setFormError(errors?.email && { email: errors?.email });
    if (errors?.email) {
      return;
    }

    try {
      const data = {
        email,
        bizType: BizType.RESET_PASS,
        appkey: LOGIN_APP_KEY,
      };
      await _userSendCode(data);
      let num = 60;
      const timer = setInterval(() => {
        num--;
        setSeconds(num);
        if (num < 1) {
          setSeconds(60);
          clearInterval(timer);
        }
      }, 1000);
    } catch (error) {
      enqueueSnackbar(error as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  }, [email, enqueueSnackbar]);

  const onSubmitClick = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();
      const errors = validate(
        {
          verificationCode,
          email,
          password,
          confirmedPassword,
        },
        ForgotPasswordSchema,
      );
      setFormError(errors);

      if (errors) {
        return;
      }

      try {
        const data = {
          newPass: userpool.encode(password),
          appkey: LOGIN_APP_KEY,
          verifyCode: verificationCode,
          email,
        };
        await _userResetPassword(data);
        successCb && successCb();
        if (isRedirect) {
          await router.push('./login');
        }
      } catch (error) {
        enqueueSnackbar(error as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      }
    },
    [
      verificationCode,
      email,
      password,
      confirmedPassword,
      successCb,
      isRedirect,
      router,
      enqueueSnackbar,
    ],
  );

  const sendButtonText = useMemo(() => {
    if (seconds < 60) {
      return ['xs', 'sm', 'md', 'lg'].includes(breakpoint)
        ? `00:${seconds}`
        : `Resend in 00:${seconds}`;
    }
    return ['xs', 'sm', 'md', 'lg'].includes(breakpoint)
      ? 'Send'
      : 'Send Verification Code';
  }, [breakpoint, seconds]);

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !email || !password || !confirmedPassword || !verificationCode;
  }, [confirmedPassword, email, password, passwordError, verificationCode]);

  const FormBody = useMemo(() => {
    return (
      <Box
        className="form_body"
        component={'form'}
        onSubmit={onSubmitClick}
        sx={isNestForm ? ForgotPasswordStyles.form : {}}
      >
        <StyledTextField
          label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'Email'}
          required
          validate={formError?.email}
          value={email}
        />
        <Box className="POS_flex POS_jc_sb">
          <StyledTextField
            label={'Verification Code'}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={'Verification Code'}
            required
            value={verificationCode}
          />
          <StyledButton
            color="primary"
            disabled={seconds < 60}
            onClick={onSendCodeClick}
            sx={{ ml: 1.5 }}
            variant="contained"
          >
            {sendButtonText}
          </StyledButton>
        </Box>

        <Box>
          <StyledTextFieldPassword
            error={
              password
                ? Object.values(passwordError).filter((item) => !item).length >
                  0
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
                  className={!passwordError.noSpaceError ? 'error_active' : ''}
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
          Set Password
        </StyledButton>
      </Box>
    );
  }, [
    confirmedPassword,
    email,
    formError?.confirmedPassword,
    formError?.email,
    handledPasswordChange,
    isDisabled,
    isNestForm,
    onSendCodeClick,
    onSubmitClick,
    password,
    passwordError,
    seconds,
    sendButtonText,
    verificationCode,
  ]);

  return (
    <>
      {isNestForm ? (
        FormBody
      ) : (
        <StyledBoxWrap sx={{ ...POSFlex('center', 'center', 'column') }}>
          <Box sx={ForgotPasswordStyles.forgotPassword}>
            <Icon
              className="forgot_password_img"
              component={FORGOT_PASSWORD_SVG}
            />

            <Box className="forgot_password_form">
              <Typography className="form_title" variant="h3">
                Reset Password
              </Typography>

              {FormBody}

              <Box className="form_foot">
                <StyledButton color="info" variant="text">
                  <Link href={'./login/'}> Back to Log In</Link>
                </StyledButton>
              </Box>
            </Box>
          </Box>
        </StyledBoxWrap>
      )}
    </>
  );
};
