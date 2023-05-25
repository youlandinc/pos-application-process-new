import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Icon, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { ChangePasswordStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
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
      } catch (error) {
        enqueueSnackbar(error as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
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
      <StyledBoxWrap sx={{ ...POSFlex('center', 'center', 'column') }}>
        <Box sx={ChangePasswordStyles}>
          <Icon
            className="change_password_img"
            component={CHANGE_PASSWORD_SVG}
          />

          <Box className="change_password_form">
            <Typography className="form_title" variant="h3">
              Change Password
            </Typography>

            <Box
              className="form_body"
              component={'form'}
              onSubmit={onSubmitClick}
            >
              <StyledTextField
                label={'Existing Password'}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={'Existing Password'}
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
                  label={'Password'}
                  onChange={handledPasswordChange}
                  placeholder={'New Password'}
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
                label={'Confirmed Password'}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                placeholder={'Confirmed New Password'}
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
                Change Password
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
