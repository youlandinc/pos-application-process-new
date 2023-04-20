import { FC, useState } from 'react';
import Link from 'next/link';

import { Box, Icon, Typography } from '@mui/material';

import { LoginStyles } from './index';
import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import LOG_IN_SVG from '@/svg/log_in.svg';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box
      sx={{
        ...LoginStyles,
      }}
    >
      <Icon className="sign_in_img" component={LOG_IN_SVG} />
      <Box className="sign_in_form">
        <Typography className="form_title" variant="h3">
          Welcome to YouLand!
        </Typography>
        <Box className="form_body">
          <StyledTextField
            label={'Email'}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Email'}
            value={email}
          />
          <StyledTextFieldPassword
            label={'Password'}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={'Password'}
            value={password}
          />
          <StyledButton color="primary" variant="contained">
            Continue
          </StyledButton>
        </Box>
        <Box className="form_foot">
          <Typography variant="body2">
            Don&apos;t have an account?
            <Box
              component={'span'}
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={'/auth/sign_up/'}> Sign Up</Link>
            </Box>
          </Typography>
          <Typography variant="body2">
            <Link href={''}>Forgot password?</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
