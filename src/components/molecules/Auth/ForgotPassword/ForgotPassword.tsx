import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { ForgotPasswordProps, ForgotPasswordStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledHeaderLogo,
  StyledTextField,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import {
  AUTO_HIDE_DURATION,
  ForgotPasswordSchema,
  LOGIN_APP_KEY,
  userpool,
} from '@/constants';
import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { BizType, HttpError } from '@/types';
import { _userResetPassword, _userSendCodeForResetPassword } from '@/requests';

import FORGOT_PASSWORD_SVG from '@/svg/auth/forgot_password.svg';

export const ForgotPassword: FC<ForgotPasswordProps> = ({
  isNestForm = false,
  successCb,
  isRedirect = true,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const breakpoint = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
      await _userSendCodeForResetPassword(data);
      let num = 60;
      const timer = setInterval(() => {
        num--;
        setSeconds(num);
        if (num < 1) {
          setSeconds(60);
          clearInterval(timer);
        }
      }, 1000);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
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
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
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
      return ['xs', 'sm', 'md', 'lg'].includes(breakpoint) || isNestForm
        ? `00:${seconds}`
        : `Resend in 00:${seconds}`;
    }
    return ['xs', 'sm', 'md', 'lg'].includes(breakpoint) || isNestForm
      ? 'Send'
      : 'Send verification code';
  }, [breakpoint, isNestForm, seconds]);

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
          inputProps={{
            autoComplete: 'new-password',
          }}
          label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'Email'}
          required
          validate={formError?.email}
          value={email}
        />
        <Box className="POS_flex POS_jc_sb">
          <StyledTextField
            inputProps={{
              autoComplete: 'new-password',
            }}
            label={'Verification code'}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={'Verification code'}
            required
            value={verificationCode}
          />
          <StyledButton
            color="primary"
            disabled={!email || seconds < 60}
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
            inputProps={{
              autoComplete: 'new-password',
            }}
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
          inputProps={{
            autoComplete: 'new-password',
          }}
          label={'Confirm password'}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          placeholder={'Confirm password'}
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
          Set password
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
              ...POSFlex('center', 'center', 'column'),
              minHeight: 'calc(100vh - 92px)',
            }}
          >
            <Box sx={ForgotPasswordStyles.forgotPassword}>
              <Icon
                component={FORGOT_PASSWORD_SVG}
                sx={{
                  flex: 1,
                  width: '100%',
                  height: 'auto',
                  display: { xs: 'none', lg: 'block' },
                  '& .forgot_password_svg__pos_svg_theme_color': {
                    fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                  },
                }}
              />

              <Box className="forgot_password_form">
                <Typography className="form_title" variant="h3">
                  Reset password
                </Typography>

                {FormBody}

                <Box className="form_foot">
                  <StyledButton color="info" variant="text">
                    <Link href={'/auth/login'}> Back to log in</Link>
                  </StyledButton>
                </Box>
              </Box>
            </Box>
          </StyledBoxWrap>
        </>
      )}
    </>
  );
};
