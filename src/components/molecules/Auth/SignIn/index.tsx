import { FC, useState } from 'react';
import Link from 'next/link';

import { Box, Typography } from '@mui/material';

import {
  StyledButton,
  StyledTextField,
  StyledTextFieldPassword,
} from '@/components/atoms';

export const SignIn: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Box
      sx={{
        px: {
          md: '7.5vw',
          sm: 0,
        },
        display: 'flex',
        justifyContent: 'space-between',
        mt: 18,
      }}
    >
      <Box
        sx={{
          width: {
            md: '48%',
            sm: 0,
          },
          backgroundImage: "url('/sign_in.svg')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      >
        {/* <Image
          alt={''}
          // fill
          layout="fill"
          objectFit={'contain'}
          priority
          src={'/sign_in.svg'}
        /> */}
      </Box>
      <Box
        sx={{
          boxShadow: {
            md: '0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
            sm: 'none',
          },
          px: {
            md: 4,
            sm: 3,
            xs: 3,
          },
          py: 6.5,
          width: {
            md: '48%',
            sm: '100%',
            xs: '100%',
          },
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: {
              md: 32,
              sm: 24,
            },
          }}
          variant="h3"
        >
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

        <Box
          sx={{
            display: 'flex',
            mt: 3,
            flexFlow: {
              md: 'inherit',
              sm: 'column',
              xs: 'column',
            },
            textAlign: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'center', xs: 'center' },
            }}
          >
            Don&apos;t have an account?
            <Box
              sx={{
                color: 'primary.main',
              }}
            >
              <Link href={''}>Sign Up</Link>
            </Box>
          </Box>
          <Link href={''}>Forgot password?</Link>
        </Box>
      </Box>
    </Box>
  );
};
