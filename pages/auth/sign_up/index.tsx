import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

import { useCheckHasLoggedIn } from '@/hooks';

const DynamicSignUp = dynamic(
  () => import('@/components/molecules/Auth/SignUp').then((mod) => mod.SignUp),
  {
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
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

const SignUpPage: FC = observer((): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <Box>
      <DynamicSignUp isRedirect={false} />
    </Box>
  );
});

export default SignUpPage;
