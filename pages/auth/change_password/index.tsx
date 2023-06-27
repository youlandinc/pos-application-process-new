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

const ChangePasswordPage: FC = observer((): JSX.Element => {
  return (
    <Box>
      <DynamicChangePassword />
    </Box>
  );
});

export default ChangePasswordPage;
