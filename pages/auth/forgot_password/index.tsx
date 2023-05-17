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
    loading: () => <CircularProgress />,
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
