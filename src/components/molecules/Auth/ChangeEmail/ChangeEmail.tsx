import { FC, FormEventHandler, useCallback, useMemo, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { validate } from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useSwitch } from '@/hooks';
import { ChangeEmailStyles } from './index';
import { POSFlex } from '@/styles';
import {
  AUTO_HIDE_DURATION,
  EmailSchema,
  LOGIN_APP_KEY,
  userpool,
} from '@/constants';
import { BizType, HttpError } from '@/types';
import { _userChangeEmail, _userCompletedChangeEmail } from '@/requests';

import {
  StyledBoxWrap,
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
  StyledTextField,
  StyledTextFieldOtp,
} from '@/components/atoms';

import CHANGE_EMAIL_SVG from '@/svg/auth/change_email.svg';

export const ChangeEmail: FC = observer(() => {
  const router = useRouter();
  const { userProfile } = useMst();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

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
      await _userCompletedChangeEmail(data);
      close();
      const { username } = JSON.parse(
        localStorage.getItem('PROFILE_KEY') as string,
      );
      userpool.setLastAuthUserInfo(username, 'email', email);
      const lastAuthId = userpool.getLastAuthUserId();
      if (lastAuthId) {
        await userpool.refreshToken(lastAuthId);
      }
      enqueueSnackbar('Email changed successfully!', {
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
    } finally {
      setLoading(false);
    }
  }, [close, email, enqueueSnackbar, otp, router]);

  const isDisabled = useMemo(() => {
    return !newEmail;
  }, [newEmail]);

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
        <Box sx={ChangeEmailStyles}>
          <Icon
            component={CHANGE_EMAIL_SVG}
            sx={{
              flex: 1,
              width: '100%',
              height: 'auto',
              display: { xs: 'none', lg: 'block' },
              '& .change_email_svg__pos_svg_theme_color': {
                fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
              },
            }}
          />

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
          <Box mt={3} overflow={'hidden'}>
            <Typography
              className={'POS_tl POS_fullwidth'}
              color={'text.secondary'}
              component={'div'}
              variant={'body2'}
            >
              An email with a verification code has been sent to{' '}
              <Typography component={'span'} variant={'subtitle2'}>
                {newEmail}
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
              Didn&apos;t receive verification code?{' '}
              <Typography
                color={loading ? 'action.disabled' : 'text.primary'}
                component={'span'}
                onClick={handledSubmit}
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
    </>
  );
});
