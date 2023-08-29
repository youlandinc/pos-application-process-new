import { FC } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicChangeEmail = dynamic(
  () =>
    import('@/components/molecules/Auth/ChangeEmail').then(
      (mod) => mod.ChangeEmail,
    ),
  {
    ssr: true,
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
