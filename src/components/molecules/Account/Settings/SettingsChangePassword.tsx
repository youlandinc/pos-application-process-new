import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { validate } from 'validate.js';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import {
  AUTO_HIDE_DURATION,
  ChangePasswordSchema,
  userpool,
} from '@/constants';

import {
  StyledButton,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import { _updateUserInfoPassword } from '@/requests';
import { HttpError } from '@/types';

export const SettingsChangePassword: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

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

      setLoading(true);
      try {
        await _updateUserInfoPassword({
          oldPass: userpool.encode(oldPassword),
          newPass: userpool.encode(confirmedPassword),
        });
        enqueueSnackbar('Password changed successfully', {
          variant: 'success',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        router.reload();
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
    [password, confirmedPassword, oldPassword, enqueueSnackbar],
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
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      gap={{ xs: 2, md: 3 }}
      onSubmit={onSubmitClick}
      p={{ xs: 2, md: 3 }}
    >
      <Typography fontSize={{ xs: 16, md: 20 }} variant={'h6'}>
        Change your password
      </Typography>

      <StyledTextFieldPassword
        disabled={loading}
        inputProps={{
          autoComplete: 'new-password',
        }}
        label={'Current password'}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder={'Current password'}
        value={oldPassword}
      />

      <Stack>
        <StyledTextFieldPassword
          disabled={loading}
          error={
            password
              ? Object.values(passwordError).filter((item) => !item).length > 0
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
      </Stack>

      <StyledTextFieldPassword
        disabled={loading}
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
        color={'primary'}
        disabled={isDisabled || loading}
        loading={loading}
        sx={{ width: { xs: '100%', lg: 200 } }}
        type={'submit'}
      >
        Change password
      </StyledButton>
    </Stack>
  );
};
