import { ChangeEventHandler, FC, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import { Box, Icon, Typography } from '@mui/material';

import { ForgotPasswordProps, ForgotPasswordStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
  Transitions,
} from '@/components/atoms';

import FORGOT_PASSWORD_SVG from '@/svg/auth/forgot_password.svg';
import { SignUpSchema } from '@/constants';
import { useBreakpoints } from '@/hooks';

export const ForgotPassword: FC<ForgotPasswordProps> = ({
  isNestForm = false,
}) => {
  const breakpoint = useBreakpoints();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [seconds, setSeconds] = useState(60);
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

  const sendVerificationCode = () => {
    let num = 60;
    const timer = setInterval(() => {
      num--;
      setSeconds(num);
      if (num < 1) {
        setSeconds(60);
        clearInterval(timer);
      }
    }, 1000);
  };

  const sendButtonText = useMemo(() => {
    if (seconds < 60) {
      return ['xs', 'sm', 'md', 'lg'].includes(breakpoint)
        ? `00:${seconds}`
        : `Resend in 00:${seconds}`;
    }
    return ['xs', 'sm', 'md', 'lg'].includes(breakpoint)
      ? 'Send'
      : 'Send Verification Code';
  }, [breakpoint, seconds]);

  const isDisabled = useMemo(() => {
    for (const [, value] of Object.entries(passwordError)) {
      if (!value) {
        return true;
      }
    }
    return !email || !password || !confirmedPassword || !verificationCode;
  }, [confirmedPassword, email, password, passwordError, verificationCode]);

  return (
    <>
      {isNestForm ? (
        <Box
          className="form_body"
          component={'form'}
          onSubmit={() => {}}
          sx={ForgotPasswordStyles}
        >
          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            required
            value={email}
          />
          <Box className="POS_f_jc_c">
            <StyledTextField
              label={'Verification Code'}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder={'Verification Code'}
              required
              value={verificationCode}
            />
            <StyledButton
              color="primary"
              disabled={seconds < 60}
              onClick={sendVerificationCode}
              sx={{ ml: 1.5 }}
              variant="contained"
            >
              {sendButtonText}
            </StyledButton>
          </Box>

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
            label={'Confirmed Password'}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            placeholder={'Confirmed Password'}
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
            Set Password
          </StyledButton>
        </Box>
      ) : (
        <StyledBoxWrap sx={{ ...POSFlex('center', 'center', 'column') }}>
          <Box sx={ForgotPasswordStyles}>
            <Icon
              className="forgot_password_img"
              component={FORGOT_PASSWORD_SVG}
            />

            <Box className="forgot_password_form">
              <Typography className="form_title" variant="h3">
                Reset Password
              </Typography>

              <Box className="form_body" component={'form'} onSubmit={() => {}}>
                <StyledTextField
                  label={'Email'}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={'Email'}
                  required
                  value={email}
                />
                <Box className="POS_f_jc_c">
                  <StyledTextField
                    label={'Verification Code'}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={'Verification Code'}
                    required
                    value={verificationCode}
                  />
                  <StyledButton
                    color="primary"
                    disabled={seconds < 60}
                    onClick={sendVerificationCode}
                    sx={{ ml: 1.5 }}
                    variant="contained"
                  >
                    {sendButtonText}
                  </StyledButton>
                </Box>

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
                    placeholder={'Password'}
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
                  placeholder={'Confirmed Password'}
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
                  Set Password
                </StyledButton>
              </Box>

              <Box className="form_foot">
                <StyledButton color="info" variant="text">
                  <Link href={'./login/'}> Back to Log In</Link>
                </StyledButton>
              </Box>
            </Box>
          </Box>
        </StyledBoxWrap>
      )}
    </>
  );
};
