import { FC, FormEventHandler, useCallback, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { AUTO_HIDE_DURATION, EmailSchema, userpool } from '@/constants';

import validate from '@/constants/validate';

import {
  StyledButton,
  StyledDatePicker,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

import { AccountUserProfileParams, HttpError } from '@/types';
import { _updateUserInfo } from '@/requests';

// import { validate } from 'validate.js';

interface SettingsChangeProfileProps {
  store: AccountUserProfileParams;
  dispatch: any;
}

export const SettingsChangeProfile: FC<SettingsChangeProfileProps> = ({
  store,
  dispatch,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const onSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();

      const validateParams = store.phone
        ? { email: store.email, phone: store.phone }
        : { email: store.email };

      const errors = validate(validateParams, EmailSchema);

      if (errors) {
        Object.keys(errors).forEach((key) => {
          switch (key) {
            case 'phone':
              setPhoneError(true);
              break;
            case 'email':
              setEmailError(true);
              break;
          }
        });
        return;
      }

      const dateValid = (date: any) => {
        return isValid(date) && isDate(date);
      };

      const params = {
        ...store,
        birthday: dateValid(store.birthday)
          ? format(store.birthday as Date, 'yyyy-MM-dd')
          : null,
      };

      setLoading(true);
      try {
        const {
          data: {
            userProfile: {
              firstName,
              lastName,
              birthday,
              email,
              phone,
              avatar,
              backgroundColor,
            },
          },
        } = await _updateUserInfo(params);

        dispatch({
          type: 'init',
          payload: {
            avatar: avatar || '',
            firstName: firstName || '',
            lastName: lastName || '',
            birthday: birthday ? new Date(birthday) : null,
            email: email || '',
            phone: phone || '',
          },
        });

        const lastAuthId = userpool.getLastAuthUserId();
        if (lastAuthId) {
          await userpool.refreshToken(lastAuthId);
        }

        userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName);
        userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName);
        userpool.setLastAuthUserInfo(lastAuthId, 'background', backgroundColor);

        enqueueSnackbar('Profile updated', {
          variant: 'success',
        });
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
    [dispatch, enqueueSnackbar, store],
  );

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      gap={{ xs: 2, md: 3 }}
      onSubmit={onSubmit}
      p={{ xs: 2, md: 3 }}
    >
      <Typography fontSize={{ xs: 16, md: 20 }} variant={'h6'}>
        Personal information
      </Typography>

      <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
        <StyledTextField
          label={'First name'}
          onChange={(e) => {
            dispatch({
              type: 'change',
              payload: {
                field: 'firstName',
                value: (e.target.value as string).replace(/^./, (match) =>
                  match.toUpperCase(),
                ),
              },
            });
          }}
          placeholder={'First name'}
          required
          value={store.firstName}
        />
        <StyledTextField
          label={'Last name'}
          onChange={(e) => {
            dispatch({
              type: 'change',
              payload: {
                field: 'lastName',
                value: (e.target.value as string).replace(/^./, (match) =>
                  match.toUpperCase(),
                ),
              },
            });
          }}
          placeholder={'Last name'}
          required
          value={store.lastName}
        />
      </Stack>

      <StyledDatePicker
        disableFuture={false}
        label={'Date of birth'}
        onChange={(value) => {
          dispatch({
            type: 'change',
            payload: {
              field: 'birthday',
              value,
            },
          });
        }}
        value={store.birthday}
      />

      <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
        <StyledTextFieldPhone
          error={phoneError}
          label={'Phone number'}
          onValueChange={({ value }) => {
            dispatch({
              type: 'change',
              payload: {
                field: 'phone',
                value,
              },
            });
            setPhoneError(false);
          }}
          placeholder={'Phone number'}
          value={store.phone}
        />
        <StyledTextField
          error={emailError}
          label={'Contact email'}
          onChange={(e) => {
            dispatch({
              type: 'change',
              payload: {
                field: 'email',
                value: e.target.value,
              },
            });
            setEmailError(false);
          }}
          placeholder={'Contact email'}
          required
          value={store.email}
        />
      </Stack>

      <StyledButton
        disabled={loading}
        loading={loading}
        sx={{ width: { xs: '100%', lg: 200 } }}
        type={'submit'}
      >
        Change info
      </StyledButton>
    </Stack>
  );
};
