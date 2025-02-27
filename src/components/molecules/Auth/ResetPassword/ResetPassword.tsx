import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import validate from '@/constants/validate';

import {
  AUTO_HIDE_DURATION,
  ChangePasswordSchema,
  userpool,
} from '@/constants';

import {
  StyledButton,
  StyledHeaderLogo,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import { HttpError } from '@/types';
import { _forceUpdatePassword } from '@/requests';

import FORGOT_PASSWORD_SVG from '@/svg/auth/forgot_password.svg';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

export const ResetPassword: FC = observer(() => {
  const router = useRouter();

  const { session } = useMst();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [formError, setFormError] = useState<
    Partial<Record<keyof typeof ChangePasswordSchema, string[]>> | undefined
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

  const onSubmitClick = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const errors = validate(
        {
          password,
          confirmedPassword,
        },
        ChangePasswordSchema,
      );
      setFormError(errors);
      if (errors) {
        return;
      }

      setLoading(true);
      try {
        await _forceUpdatePassword({
          newPass: userpool.encode(confirmedPassword),
        });
        enqueueSnackbar('Password changed successfully', {
          variant: 'success',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        return router.push({ pathname: '/pipeline', query: router.query });
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
    [password, confirmedPassword, enqueueSnackbar, router],
  );

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !password || !confirmedPassword;
  }, [confirmedPassword, password, passwordError]);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [router, session]);

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

      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        minHeight={'calc(100vh - 92px)'}
      >
        <Box
          height={'100%'}
          px={{
            lg: 0,
            xs: 'clamp(24px,6.4vw,60px)',
          }}
          py={'clamp(24px,6.4vw,60px)'}
          width={{
            xxl: 1440,
            xl: 1240,
            lg: 976,
            xs: '100%',
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
                  fill: (theme) => theme.palette.primary.main,
                },
              }}
            />

            <Stack
              borderRadius={2}
              boxShadow={{
                lg: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
                xs: 'none',
              }}
              component={'form'}
              flex={1}
              gap={3}
              onSubmit={onSubmitClick}
              px={{ lg: 4, xs: 3 }}
              py={7}
              width={{ lg: '700px', xs: '100%' }}
            >
              <Typography
                fontSize={'clamp(24px,2.5vw,32px)'}
                textAlign={'center'}
                variant={'h3'}
              >
                Set password
              </Typography>

              <Stack>
                <StyledTextFieldPassword
                  error={
                    password
                      ? Object.values(passwordError).filter((item) => !item)
                          .length > 0
                      : false
                  }
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  label={'New password'}
                  onChange={handledPasswordChange}
                  placeholder={'New password'}
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
                        className={
                          !passwordError.lengthError ? 'error_active' : ''
                        }
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
                        className={
                          !passwordError.letterError ? 'error_active' : ''
                        }
                        component={'li'}
                      >
                        At least one letter
                      </Box>
                      <Box
                        className={
                          !passwordError.numberError ? 'error_active' : ''
                        }
                        component={'li'}
                      >
                        At least one number
                      </Box>
                    </Box>
                  )}
                </Transitions>
              </Stack>

              <StyledTextFieldPassword
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'Confirm new password'}
                onChange={(e) => {
                  if (formError?.confirmedPassword) {
                    setFormError({
                      ...formError,
                      confirmedPassword: undefined,
                    });
                  }
                  setConfirmedPassword(e.target.value);
                }}
                placeholder={'Confirm new password'}
                validate={formError?.confirmedPassword}
                value={confirmedPassword}
              />

              <StyledButton
                disabled={isDisabled || loading}
                loading={loading}
                sx={{ width: '100%' }}
                type={'submit'}
              >
                Set password
              </StyledButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  );
});
