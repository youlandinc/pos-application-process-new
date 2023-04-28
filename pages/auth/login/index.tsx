import { FC } from 'react';
import { Box } from '@mui/material';

import { useCheckHasLoggedIn } from '@/hooks';

import { Login } from '@/components';

const LoginPage: FC = (): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <Box>
      <Login to={'/pipeline'} />
    </Box>
  );
};

export default LoginPage;
