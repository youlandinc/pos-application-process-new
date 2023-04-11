import { SignIn } from '@/components/molecules';
import { Box } from '@mui/material';
import { FC } from 'react';

const LoginPage: FC = (): JSX.Element => {
  return (
    <Box>
      <SignIn />
    </Box>
  );
};

export default LoginPage;
