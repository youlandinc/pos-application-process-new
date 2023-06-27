import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicChangeEmail = dynamic(
  () =>
    import('@/components/molecules/Auth/ChangeEmail').then(
      (mod) => mod.ChangeEmail,
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

const ChangeEmailPage: FC = observer((): JSX.Element => {
  return (
    <Box>
      <DynamicChangeEmail />
    </Box>
  );
});

export default ChangeEmailPage;
