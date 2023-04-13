import { FC, useState } from 'react';
import Link from 'next/link';

import { Box, Typography } from '@mui/material';

import { SignUpStyles } from './index';
import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

export const SignUp: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box
      sx={{
        ...SignUpStyles,
      }}
    >
      <Box className="sign_up_img"></Box>
      <Box className="sign_up_form">
        <Typography className="form_title" variant="h3">
          sign up
        </Typography>

        <StyledTextField
          label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'Email'}
          sx={{ width: '100%', my: 3 }}
          value={email}
        />
        <StyledTextFieldPassword
          label={'Password'}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'Password'}
          sx={{ width: '100%' }}
          value={password}
        />
        <StyledTextFieldPassword
          label={'Confirmed Password'}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={'Confirmed Password'}
          sx={{ width: '100%' }}
          value={password}
        />
        <StyledButton
          color="primary"
          sx={{ width: '100%' }}
          variant="contained"
        >
          Create account
        </StyledButton>

        <Box className="form_foot">
          <Typography variant="body2">
            Already have an account?
            <Box
              component={'span'}
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={'/auth/login/'}>Sign in</Link>
            </Box>
          </Typography>
          <Typography sx={{ color: 'info.main', mt: 3 }} variant="body2">
            By signing up, you agree to our{' '}
            <Box
              component={'span'}
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={''}> Term of Use </Link>
            </Box>
            and to receive YouLand emails & updates and acknowledge that you
            read our{' '}
            <Box
              component={'span'}
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={''}> Privacy Policy</Link>
            </Box>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
