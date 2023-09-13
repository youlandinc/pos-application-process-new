import { FC, FormEventHandler, useCallback, useMemo, useState } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSwitch } from '@/hooks';
import { ChangeEmailStyles } from './index';
import { POSFlex } from '@/styles';
import {
  AUTO_HIDE_DURATION,
  EmailSchema,
  LOGIN_APP_KEY,
  userpool,
} from '@/constants';
import { BizType } from '@/types';
import { _userChangeEmail, _userVerifyCode } from '@/requests';

import {
  StyledBoxWrap,
  StyledButton,
  StyledDialog,
  StyledTextField,
  StyledTextFieldOtp,
} from '@/components/atoms';

import CHANGE_EMAIL_SVG from '@/svg/auth/change_email.svg';

export const ChangeEmail: FC = observer(() => {
  const router = useRouter();
  const { userProfile } = useMst();
  const { enqueueSnackbar } = useSnackbar();

  const { email = '' } = userProfile || {};
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<
    Partial<Record<keyof typeof EmailSchema, string[]>> | undefined
  >();

  const { open, close, visible } = useSwitch(false);

  const handledSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();

      const newFormErrors = validate(
        {
          email: newEmail,
        },
        EmailSchema,
      );
      setFormError(newFormErrors);

      if (newFormErrors) {
        return;
      }

      try {
        setLoading(true);
        await _userChangeEmail({ oldEmail: email, newEmail });
        open();
      } catch (err) {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      } finally {
        setLoading(false);
      }
    },
    [email, enqueueSnackbar, newEmail, open],
  );

  const handledVerifyOtp = useCallback(async () => {
    const data = {
      appkey: LOGIN_APP_KEY,
      code: otp,
      email,
      bizType: BizType.REGISTER,
    };
    setLoading(true);
    try {
      await _userVerifyCode(data);
      close();
      const { username } = JSON.parse(
        localStorage.getItem('PROFILE_KEY') as string,
      );
      userpool.setLastAuthUserInfo(username, 'email', email);
      enqueueSnackbar('Email changed successfully!', {
        variant: 'success',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      await router.push('./login');
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setLoading(false);
    }
  }, [close, email, enqueueSnackbar, otp, router]);

  const isDisabled = useMemo(() => {
    return !newEmail;
  }, [newEmail]);

  return (
    <>
      <StyledBoxWrap
        sx={{
          ...POSFlex('center', 'center', 'column'),
          minHeight: '100vh',
        }}
      >
        <Box sx={ChangeEmailStyles}>
          <Icon className="change_email_img" component={CHANGE_EMAIL_SVG} />

          <Box className="change_email_form">
            <Typography className="form_title" variant="h3">
              Change email
            </Typography>
            <Box
              className="form_body"
              component={'form'}
              onSubmit={handledSubmit}
            >
              <StyledTextField
                disabled
                label={'Email'}
                placeholder={'Email'}
                value={email}
              />
              <StyledTextField
                disabled={loading}
                label={'New email'}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={'New email'}
                required
                validate={formError?.email}
                value={newEmail}
              />

              <StyledButton
                color="primary"
                disabled={isDisabled || loading}
                type={'submit'}
                variant="contained"
              >
                Change email
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
      <StyledDialog
        content={
          <Box>
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
              <StyledTextFieldOtp onChange={(v) => setOtp(v)} />
            </Box>
            <Typography
              className={'POS_tc POS_fullwidth'}
              color={'text.secondary'}
              component={'div'}
              mt={3}
              variant={'body2'}
            >
              Didn&apos;t verification code?{' '}
              <Typography
                color={'text.primary'}
                component={'span'}
                onClick={handledVerifyOtp}
                variant={'body2'}
              >
                Request again
              </Typography>
            </Typography>
          </Box>
        }
        disableEscapeKeyDown
        footer={
          <>
            <StyledButton
              disabled={loading}
              onClick={close}
              size={'small'}
              sx={{ mr: 1 }}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={loading}
              onClick={handledVerifyOtp}
              size={'small'}
            >
              Confirm
            </StyledButton>
          </>
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
    </>
  );
});
