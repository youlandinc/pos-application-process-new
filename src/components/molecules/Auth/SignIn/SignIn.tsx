import { FC, useState } from 'react';
import Link from 'next/link';

import { Box, Typography } from '@mui/material';

import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

import { SignInClasses } from '@/components/molecules';
export const SignIn: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box
      sx={{
        ...SignInClasses,
      }}
    >
      <Box className="sign_in_img"></Box>
      <Box className="sign_in_form">
        <Typography className="form_title" variant="h3">
          Welcome to YouLand!
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
        <StyledButton
          color="primary"
          sx={{ width: '100%' }}
          variant="contained"
        >
          Continue
        </StyledButton>

        <Box className="form_foot">
          <Typography variant="body2">
            Don&apos;t have an account?
            <Box
              component={'span'}
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={''}>Sign Up</Link>
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
