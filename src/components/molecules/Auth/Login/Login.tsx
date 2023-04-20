import { FC, useMemo, useState } from 'react';
import Link from 'next/link';

import { Box, Icon, Typography } from '@mui/material';

import { LoginStyles } from './index';
import { POSFlex } from '@/styles';

import {
  StyledBoxWrap,
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import LOG_IN_SVG from '@/svg/auth/log_in.svg';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isDisabled = useMemo(() => {
    return !email || !password;
  }, [email, password]);

  return (
    <StyledBoxWrap sx={{ ...POSFlex('center', 'center', 'column') }}>
      <Box sx={LoginStyles}>
        <Icon className="sign_in_img" component={LOG_IN_SVG} />

        <Box className="sign_in_form">
          <Typography className="form_title" variant="h3">
            Welcome to YouLand!
          </Typography>

          <Box className="form_body" component={'form'}>
            <StyledTextField
              label={'Email'}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Email'}
              required
              value={email}
            />
            <StyledTextFieldPassword
              label={'Password'}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={'Password'}
              required
              value={password}
            />
            <StyledButton
              color="primary"
              disabled={isDisabled}
              variant="contained"
            >
              Continue
            </StyledButton>
          </Box>

          <Box className="form_foot">
            <Typography variant="body2">
              Don&apos;t have an account?
              <Typography
                color={'primary'}
                component={'span'}
                variant={'body2'}
              >
                <Link href={'./sign_up/'}> Sign Up</Link>
              </Typography>
            </Typography>
            <Typography color={'primary'} variant="body2">
              <Link href={''}>Forgot Password?</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledBoxWrap>
  );
};
