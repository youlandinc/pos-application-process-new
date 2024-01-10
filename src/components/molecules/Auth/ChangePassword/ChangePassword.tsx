import { useSessionStorageState } from '@/hooks';
import { HttpError } from '@/types';
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

import { ChangePasswordStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledHeaderLogo,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import CHANGE_PASSWORD_SVG from '@/svg/auth/change_password.svg';
import {
  AUTO_HIDE_DURATION,
  ChangePasswordSchema,
  userpool,
} from '@/constants';

import { _userChangePassword } from '@/requests';

export const ChangePassword: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [oldPassword, setOldPassword] = useState('');

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

      try {
        await _userChangePassword({
          oldPass: userpool.encode(oldPassword),
          newPass: userpool.encode(confirmedPassword),
        });
        enqueueSnackbar('Password changed successfully', {
          variant: 'success',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        await router.push('./login');
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
    [password, confirmedPassword, oldPassword, enqueueSnackbar, router],
  );

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !oldPassword || !password || !confirmedPassword;
  }, [confirmedPassword, oldPassword, password, passwordError]);

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
          ...POSFlex('center', 'center', 'column'),
          minHeight: 'calc(100vh - 92px)',
        }}
      >
        <Box sx={ChangePasswordStyles}>
          <Icon
            component={CHANGE_PASSWORD_SVG}
            sx={{
              flex: 1,
              width: '100%',
              height: 'auto',
              display: { xs: 'none', lg: 'block' },
              '& .change_password_svg__pos_svg_theme_color': {
                fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
              },
            }}
          />

          <Box className="change_password_form">
            <Typography className="form_title" variant="h3">
              Change password
            </Typography>

            <Box
              className="form_body"
              component={'form'}
              onSubmit={onSubmitClick}
            >
              <StyledTextFieldPassword
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'Existing password'}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={'Existing password'}
                required
                value={oldPassword}
              />

              <Box>
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
                  label={'Password'}
                  onChange={handledPasswordChange}
                  placeholder={'New password'}
                  required
                  value={password}
                />
                <Transitions>
                  {password && (
                    <Box className={'password_error_list'} component={'ul'}>
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
              </Box>
              <StyledTextFieldPassword
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'Confirm password'}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                placeholder={'Confirmed new password'}
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
                Change password
              </StyledButton>
            </Box>

            <Box className="form_foot">
              <StyledButton
                color="info"
                onClick={() => router.back()}
                variant="text"
              >
                Back
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </StyledBoxWrap>
    </>
  );
};
