import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { ForgotPasswordProps } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
  StyledTextField,
  StyledTextFieldOtp,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import {
  AUTO_HIDE_DURATION,
  ForgotPasswordSchema,
  LOGIN_APP_KEY,
  userpool,
} from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';
import { BizType, HttpError } from '@/types';
import {
  _fetchUserResetPasswordSendCode,
  _fetchUserResetPasswordSubmit,
  _fetchUserResetPasswordVerifyCode,
} from '@/requests';

import FORGOT_PASSWORD_SVG from '@/svg/auth/forgot_password.svg';

export const ForgotPassword: FC<ForgotPasswordProps> = ({
  isNestForm = false,
  successCb,
  isRedirect = true,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { open, close, visible } = useSwitch(false);

  const [formState, setFormState] = useState<'initial' | 'terminal'>('initial');

  const [vrCodeLoading, setVrCodeLoading] = useState(false);
  const [email, setEmail] = useState('');

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

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

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !password || !confirmedPassword;
  }, [confirmedPassword, password, passwordError]);

  const fetchVrCode = useCallback<FormEventHandler>(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const errors = validate(
        {
          email,
        },
        ForgotPasswordSchema,
      );
      setFormError(errors);

      if (errors) {
        return;
      }

      const params = {
        appkey: LOGIN_APP_KEY,
        email,
        bizType: BizType.reset_pass,
      };

      setVrCodeLoading(true);
      try {
        await _fetchUserResetPasswordSendCode(params);
        open();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setVrCodeLoading(false);
      }
    },
    [email, enqueueSnackbar, open],
  );

  const resendVrCode = useCallback(async () => {
    const params = {
      appkey: LOGIN_APP_KEY,
      email,
      bizType: BizType.reset_pass,
    };

    setVrCodeLoading(true);
    try {
      await _fetchUserResetPasswordSendCode(params);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setVrCodeLoading(false);
    }
  }, [email, enqueueSnackbar]);

  const handleVerifyCode = useCallback(
    async (v: string) => {
      const params = {
        appkey: LOGIN_APP_KEY,
        email,
        code: v,
        bizType: BizType.reset_pass,
      };
      setVerifyLoading(true);

      try {
        const { data } = await _fetchUserResetPasswordVerifyCode(params);
        setAccessToken(data);
        setFormState('terminal');
        close();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setVerifyLoading(false);
      }
    },
    [close, email, enqueueSnackbar],
  );

  const onSubmitClick = useCallback<FormEventHandler>(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const errors = validate(
        {
          password,
          confirmedPassword,
        },
        ForgotPasswordSchema,
      );

      if (errors.confirmedPassword) {
        setFormError(errors);
        return;
      }

      const params = {
        accessToken,
        newPass: userpool.encode(confirmedPassword),
        appkey: LOGIN_APP_KEY,
      };

      setSubmitLoading(true);

      try {
        await _fetchUserResetPasswordSubmit(params);
        successCb?.();
        if (isRedirect) {
          await router.push('/auth/login');
        }
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setSubmitLoading(false);
      }
    },
    [
      accessToken,
      confirmedPassword,
      enqueueSnackbar,
      isRedirect,
      password,
      router,
      successCb,
    ],
  );

  const FormBody = useMemo(() => {
    if (formState === 'initial') {
      return (
        <Stack
          component={'form'}
          gap={3}
          mt={isNestForm ? 3 : 0}
          onSubmit={fetchVrCode}
        >
          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            validate={formError?.email}
            value={email}
          />

          <StyledButton
            disabled={!email || vrCodeLoading}
            loading={vrCodeLoading}
            type={'submit'}
          >
            Next
          </StyledButton>

          <StyledDialog
            content={
              <Stack gap={3} overflow={'hidden'}>
                <Typography
                  color={'text.secondary'}
                  component={'div'}
                  textAlign={'left'}
                  variant={'body2'}
                >
                  We&apos;ve sent a code to{' '}
                  <Typography component={'span'} variant={'subtitle2'}>
                    {email}
                  </Typography>
                </Typography>

                <Stack alignItems={'center'}>
                  <StyledTextFieldOtp
                    disabled={verifyLoading}
                    onComplete={handleVerifyCode}
                  />
                </Stack>

                <Typography
                  color={'text.secondary'}
                  textAlign={'center'}
                  variant={'body2'}
                >
                  Didn&apos;t get a code?{' '}
                  <Typography
                    color={'#5B76BC'}
                    component={'span'}
                    onClick={resendVrCode}
                    sx={{
                      cursor: 'pointer',
                    }}
                    variant={'subtitle2'}
                  >
                    Click to resend
                  </Typography>
                </Typography>
              </Stack>
            }
            disableEscapeKeyDown
            footer={
              <StyledButton
                color={'info'}
                disabled={verifyLoading}
                onClick={close}
                size={'small'}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
            }
            header={
              <Typography variant={'h6'}>Enter verification code</Typography>
            }
            onClose={(e, reason) => {
              if (reason !== 'backdropClick') {
                close();
              }
            }}
            open={visible}
          />
        </Stack>
      );
    }
    return (
      <Stack
        component={'form'}
        gap={3}
        mt={isNestForm ? 3 : 0}
        onSubmit={onSubmitClick}
      >
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
              <Box
                component={'ul'}
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'success.main',
                  listStyle: 'disc',
                  listStylePosition: 'inside',
                  p: 0,
                  mt: 0.25,
                  '& .error_active': {
                    color: 'error.main',
                    transition: 'color .3s',
                  },
                }}
              >
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
          onChange={(e) => {
            if (formError?.confirmedPassword) {
              setFormError({
                ...formError,
                confirmedPassword: undefined,
              });
            }
            setConfirmedPassword(e.target.value);
          }}
          placeholder={'Confirm password'}
          required
          validate={formError?.confirmedPassword}
          value={confirmedPassword}
        />
        <StyledButton
          color="primary"
          disabled={isDisabled || submitLoading}
          loading={submitLoading}
          type={'submit'}
          variant="contained"
        >
          Set password
        </StyledButton>
      </Stack>
    );
  }, [
    close,
    confirmedPassword,
    email,
    fetchVrCode,
    formError,
    formState,
    handleVerifyCode,
    handledPasswordChange,
    isDisabled,
    isNestForm,
    onSubmitClick,
    password,
    passwordError,
    resendVrCode,
    submitLoading,
    verifyLoading,
    visible,
    vrCodeLoading,
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
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              height={'100%'}
              justifyContent={'center'}
              pb={12}
              width={'100%'}
            >
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

              <Stack
                borderRadius={2}
                boxShadow={{
                  lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
                  xs: 'none',
                }}
                className="forgot_password_form"
                flex={1}
                gap={3}
                px={{ lg: 4, xs: 3 }}
                py={7}
                width={{ lg: '700px', xs: '100%' }}
              >
                <Typography
                  fontSize={'clamp(24px,2.5vw,32px)'}
                  textAlign={'center'}
                  variant={'h3'}
                >
                  Reset password
                  <Typography color={'text.secondary'} variant={'body2'}>
                    Please enter your email address and we will send you a code
                    to verify your account.
                  </Typography>
                </Typography>

                {FormBody}

                <Stack alignItems={'center'}>
                  <StyledButton
                    color={'info'}
                    onClick={async () => {
                      await router.push('/auth/login');
                    }}
                    sx={{ width: '100%' }}
                    variant={'text'}
                  >
                    Back to log in
                  </StyledButton>
                </Stack>
              </Stack>
            </Stack>
          </StyledBoxWrap>
        </>
      )}
    </>
  );
};
