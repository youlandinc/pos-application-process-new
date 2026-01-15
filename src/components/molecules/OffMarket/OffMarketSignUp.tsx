import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFormatUrl } from '@/utils';

import {
  AUTO_HIDE_DURATION,
  LOGIN_APP_KEY,
  OPTIONS_SIGN_UP_ROLE,
  SignUpSchema,
  userpool,
} from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';

import {
  _userSendCode,
  _userSingIn,
  _userSingUp,
  _userVerifyCode,
} from '@/requests';

import { DetectActiveService } from '@/services/DetectActive';

import { BizType, HttpError, LoginType, UserType } from '@/types';
import {
  StyledBoxWrap,
  StyledBrand,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
  StyledSelect,
  StyledTextField,
  StyledTextFieldOtp,
  StyledTextFieldPassword,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

import { SignUpProps, SignUpStyles } from '@/components/molecules/Auth/SignUp';

import { User } from '@/types/user';

import validate from '@/constants/validate';

export const OffMarketSignUp = observer<SignUpProps>(
  ({ isNestForm = false, isRedirect = true, successCb }) => {
    const router = useRouter();
    const { saasState } = useSessionStorageState('tenantConfig');
    const { enqueueSnackbar } = useSnackbar();

    const store = useMst();
    const { detectUserActiveService } = store;

    const [userType, setUserType] = useState<keyof typeof UserType>(
      UserType.CUSTOMER,
    );
    const [companyName, setCompanyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
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
        const validateSchema = {
          userType:
            saasState?.serviceTypeEnum === 'SAAS'
              ? userType
              : UserType.CUSTOMER,
          email,
          password,
          confirmedPassword,
          firstName,
          lastName,
          phone,
        };

        const errors = validate(validateSchema, SignUpSchema);
        setFormError(errors);

        if (errors) {
          return;
        }

        const params = {
          appkey: LOGIN_APP_KEY,
          emailParam: {
            email,
            firstName,
            companyName,
            lastName,
            phone,
            password: userpool.encode(password),
            userType:
              saasState?.serviceTypeEnum === 'SAAS'
                ? (userType as UserType)
                : UserType.CUSTOMER,
          },
        };

        try {
          setLoading(true);
          await _userSingUp(params);
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
          setLoading(false);
        }
      },
      [
        companyName,
        confirmedPassword,
        email,
        enqueueSnackbar,
        firstName,
        lastName,
        open,
        password,
        phone,
        saasState?.serviceTypeEnum,
        userType,
      ],
    );

    const handledLoginSuccess = useCallback(
      async (profile: User.UserSignInRequest) => {
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
        if (asPath.includes('loanId')) {
          setLoading(false);
          return router.push(asPath);
        }
        await router.push('/off-market-deals');
      },
      [router, store, successCb],
    );

    const handledLogin = useCallback(async () => {
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
    }, [
      detectUserActiveService,
      email,
      enqueueSnackbar,
      handledLoginSuccess,
      password,
    ]);

    const handledResendOtp = useCallback(async () => {
      if (loading) {
        return;
      }
      const data = {
        bizType: BizType.register,
        appkey: LOGIN_APP_KEY,
        email,
      };
      try {
        setLoading(true);
        await _userSendCode(data);
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
    }, [email, enqueueSnackbar, loading]);

    const handledVerifyOtp = useCallback(
      async (v: string) => {
        if (loading) {
          return;
        }
        const data = {
          appkey: LOGIN_APP_KEY,
          code: v,
          email,
          bizType: BizType.register,
        };
        setLoading(true);
        try {
          await _userVerifyCode(data);
          close();
          if (isRedirect) {
            await router.push('/off-market/login');
            return;
          }
          await handledLogin();
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
        close,
        email,
        enqueueSnackbar,
        handledLogin,
        isRedirect,
        loading,
        router,
      ],
    );

    const userTypeOption = useMemo(() => {
      const borrowerTypes = saasState?.posSettings?.borrowerTypes;
      if (!borrowerTypes) {
        return OPTIONS_SIGN_UP_ROLE;
      }
      const validRole = borrowerTypes.reduce(
        (cur: (keyof typeof UserType)[], next: User.POSBorrowerTypes) => {
          if (next.allowed) {
            cur.push(next.key);
          }
          return cur;
        },
        [],
      );
      if (!validRole) {
        return OPTIONS_SIGN_UP_ROLE;
      }
      const validRoleSet = new Set(validRole);
      const result = OPTIONS_SIGN_UP_ROLE.filter((option) =>
        validRoleSet.has(option.value),
      );
      if (result.length === 1) {
        setUserType(result[0].value as keyof typeof UserType);
      }
      return result;
    }, [saasState?.posSettings?.borrowerTypes]);

    const FormBody = useMemo(() => {
      return (
        <Box
          className="form_body"
          component={'form'}
          onSubmit={handledSubmit}
          sx={isNestForm ? SignUpStyles.from : {}}
        >
          {saasState?.serviceTypeEnum === 'SAAS' && (
            <StyledSelect
              disabled={loading}
              label={'Account type'}
              onChange={(e) =>
                setUserType(e.target.value as keyof typeof UserType)
              }
              options={userTypeOption}
              required
              validate={formError?.userType}
              value={userType}
            />
          )}

          <Transitions
            style={{
              width: '100%',
              display:
                userType === UserType.BROKER ||
                userType === UserType.LOAN_OFFICER
                  ? 'block'
                  : 'none',
            }}
          >
            {(userType === UserType.BROKER ||
              userType === UserType.LOAN_OFFICER) && (
              <StyledTextField
                disabled={loading}
                label={'Company name'}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={'Company name'}
                required
                value={companyName}
              />
            )}
          </Transitions>

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <StyledTextField
              disabled={loading}
              label={'First name'}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={'First name'}
              required
              value={firstName}
            />
            <StyledTextField
              disabled={loading}
              label={'Last name'}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={'Last name'}
              required
              value={lastName}
            />
          </Stack>

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <input name="email" style={{ display: 'none' }} type="text" />
            <StyledTextField
              disabled={loading}
              label={'Email'}
              onChange={(e) => {
                const value = e.target.value.trim();
                setEmail(value);
              }}
              placeholder={'Email'}
              required
              validate={formError?.email}
              value={email}
            />

            <StyledTextFieldPhone
              disabled={loading}
              label={'Phone number'}
              onValueChange={({ value }) => {
                setPhone(value);
              }}
              placeholder={'Phone number'}
              required
              validate={formError?.phone}
              value={phone}
            />
          </Stack>

          <Box sx={{ height: '1px', bgcolor: '#D2D6E1' }} />

          <Box>
            <input
              name="Password"
              style={{ display: 'none' }}
              type="password"
            />

            <StyledTextFieldPassword
              disabled={loading}
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
            disabled={loading}
            label={'Confirm password'}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder={'Confirm password'}
            required
            validate={formError?.confirmedPassword}
            value={confirmedPassword}
          />

          <StyledButton
            color="primary"
            disabled={loading}
            type={'submit'}
            variant="contained"
          >
            Create account
          </StyledButton>
        </Box>
      );
    }, [
      companyName,
      confirmedPassword,
      email,
      firstName,
      formError?.confirmedPassword,
      formError?.email,
      formError?.phone,
      formError?.userType,
      handledPasswordChange,
      handledSubmit,
      isNestForm,
      lastName,
      loading,
      password,
      passwordError,
      phone,
      saasState?.serviceTypeEnum,
      userType,
      userTypeOption,
    ]);

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
            minHeight: 'calc(100vh - 128px)',
          }}
        >
          <Box sx={SignUpStyles.singUp}>
            <Box className="sign_up_form">
              <Typography className="form_title" variant="h3">
                Sign up to view off-market deals
              </Typography>

              {FormBody}

              <Box className="form_foot">
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Typography
                    component={'span'}
                    onClick={async () => {
                      await router.push({
                        pathname: '/off-market/login/',
                        query: { ...router.query },
                      });
                    }}
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    variant="body2"
                  >
                    Log in
                  </Typography>
                </Typography>
                <Typography
                  component={'div'}
                  sx={{ color: 'info.main', mt: 3 }}
                  variant={'body2'}
                >
                  By signing up, you agree to our{' '}
                  <Typography
                    component={'span'}
                    onClick={() =>
                      window.open(
                        POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                          'https://corepass.com/legal/terms-and-conditions/',
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Terms of Use{' '}
                  </Typography>
                  and{' '}
                  <Typography
                    component={'span'}
                    onClick={() =>
                      window.open(
                        POSFormatUrl(
                          saasState?.legalAgreements?.privacyPolicyUrl,
                        ) || 'https://corepass.com/legal/privacy-policy/',
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Privacy Policy
                  </Typography>
                  ,
                </Typography>
                <Typography color={'text.secondary'} variant={'body2'}>
                  and consent to receive loan-related emails and SMS from{' '}
                  {saasState?.dbaName}.
                </Typography>
              </Box>
            </Box>
          </Box>
        </StyledBoxWrap>

        <StyledDialog
          content={
            <Box mt={3} overflow={'hidden'}>
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
                <StyledTextFieldOtp
                  disabled={loading}
                  onComplete={handledVerifyOtp}
                />
              </Box>
              <Typography
                className={'POS_tc POS_fullwidth'}
                color={'text.secondary'}
                component={'div'}
                mt={3}
                variant={'body2'}
              >
                Didn&apos;t receive verification code?{' '}
                <Typography
                  color={loading ? 'action.disabled' : 'text.primary'}
                  component={'span'}
                  onClick={handledResendOtp}
                  sx={{
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                  }}
                  variant={'body2'}
                >
                  Request again
                </Typography>
              </Typography>
            </Box>
          }
          disableEscapeKeyDown
          footer={
            <Box mt={3}>
              <StyledButton
                color={'info'}
                disabled={loading}
                onClick={close}
                size={'small'}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
            </Box>
          }
          header={
            <>
              <Typography variant={'h6'}>Thank you for joining us!</Typography>
            </>
          }
          onClose={(e, reason) => {
            if (reason !== 'backdropClick') {
              close();
            }
          }}
          open={visible}
        />
        <StyledBrand />
      </>
    );
  },
);
