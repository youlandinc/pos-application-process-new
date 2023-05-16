import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { useCheckHasLoggedIn } from '@/hooks';

const DynamicLogin = dynamic(
  () => import('@/components/molecules/Auth/Login').then((mod) => mod.Login),
  {
    ssr: false,
    loading: () => <CircularProgress />,
  },
);

const LoginPage: FC = observer((): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <Box>
      <DynamicLogin to={'/pipeline'} />
    </Box>
  );
});

export default LoginPage;
