import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';

const DynamicForgotPasswordPage = dynamic(
  () =>
    import('@/components/molecules/Auth/ForgotPassword').then(
      (mod) => mod.ForgotPassword,
    ),
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

const ForgotPasswordPage: FC = observer((): JSX.Element => {
  return (
    <Box>
      <DynamicForgotPasswordPage />
    </Box>
  );
});

export default ForgotPasswordPage;
