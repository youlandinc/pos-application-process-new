import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { useCheckHasLoggedIn } from '@/hooks';

const DynamicLogin = dynamic(
  () => import('@/components/molecules/Auth/Login').then((mod) => mod.Login),
  {
    loading: () => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 375,
          minHeight: 667,
        }}
      >
        <CircularProgress />
      </div>
    ),
    ssr: false,
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
