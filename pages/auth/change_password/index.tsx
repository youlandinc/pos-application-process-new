import { FC } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicChangePassword = dynamic(
  () =>
    import('@/components/molecules/Auth/ChangePassword').then(
      (mod) => mod.ChangePassword,
    ),
  {
    ssr: true,
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
