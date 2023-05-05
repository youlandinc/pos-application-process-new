import { FC } from 'react';
import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { useCheckHasLoggedIn } from '@/hooks';

import { Login } from '@/components';

const LoginPage: FC = observer((): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <Box>
      <Login to={'/pipeline'} />
    </Box>
  );
});

export default LoginPage;
