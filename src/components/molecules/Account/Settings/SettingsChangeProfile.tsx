import { FC, FormEventHandler, useCallback, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { format, isDate, isValid } from 'date-fns';

import { AUTO_HIDE_DURATION, EmailSchema, userpool } from '@/constants';
import { POSParseToDate } from '@/utils';

import validate from '@/constants/validate';

import {
  StyledButton,
  StyledDatePicker,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

import { AccountUserProfileParams, HttpError, UserType } from '@/types';
import { _updateUserInfo } from '@/requests';

interface SettingsChangeProfileProps {
  store: AccountUserProfileParams;
  dispatch: any;
  accountType: UserType;
}

export const SettingsChangeProfile: FC<SettingsChangeProfileProps> = ({
  store,
  dispatch,
  accountType,
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
        firstName: store.firstName,
        lastName: store.lastName,
        email: store.email,
        phone: store.phone,
        companyName: store.companyName,
        birthDay: dateValid(store.birthDay)
          ? format(store.birthDay as Date, 'yyyy-MM-dd')
          : null,
      };

      setLoading(true);
      try {
        const {
          data: {
            userProfile: {
              firstName,
              lastName,
              birthDay,
              email,
              phone,
              backgroundColor,
              companyName,
            },
          },
        } = await _updateUserInfo(params);

        dispatch({
          type: 'init',
          payload: {
            firstName: firstName || '',
            lastName: lastName || '',
            birthDay: birthDay ? new Date(birthDay) : null,
            email: email || '',
            phone: phone || '',
            companyName: companyName || '',
          },
        });

        const lastAuthId = userpool.getLastAuthUserId();
        if (lastAuthId) {
          await userpool.refreshToken(lastAuthId);
        }

        userpool.setLastAuthUserInfo(lastAuthId, 'firstName', firstName ?? '');
        userpool.setLastAuthUserInfo(lastAuthId, 'lastName', lastName ?? '');
        userpool.setLastAuthUserInfo(
          lastAuthId,
          'background',
          backgroundColor ?? '',
        );

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
          disabled={loading}
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
          disabled={loading}
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

      <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
        {(accountType === UserType.BROKER ||
          accountType === UserType.LOAN_OFFICER) && (
          <StyledTextField
            disabled={loading}
            label={'Company name'}
            onChange={(e) => {
              dispatch({
                type: 'change',
                payload: {
                  field: 'companyName',
                  value: e.target.value,
                },
              });
            }}
            placeholder={'Company name'}
            required
            value={store.companyName}
          />
        )}
        <StyledDatePicker
          disabled={loading}
          disableFuture={false}
          label={'Date of birth'}
          onChange={(value) => {
            dispatch({
              type: 'change',
              payload: {
                field: 'birthDay',
                value,
              },
            });
          }}
          value={POSParseToDate(store.birthDay)}
        />
      </Stack>

      <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
        <StyledTextFieldPhone
          disabled={loading}
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
          disabled={loading}
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
