import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicChangePassword = dynamic(
  () =>
    import('@/components/molecules/Auth/ChangePassword').then(
      (mod) => mod.ChangePassword,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const ChangePasswordPage: FC = observer((): JSX.Element => {
  return (
    <Box>
      <DynamicChangePassword />
    </Box>
  );
});

export default ChangePasswordPage;
