import { FC } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicForgotPasswordPage = dynamic(
  () =>
    import('@/components/molecules/Auth/ForgotPassword').then(
      (mod) => mod.ForgotPassword,
    ),
  {
    ssr: true,
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
