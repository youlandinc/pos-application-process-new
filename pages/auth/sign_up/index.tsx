import { FC } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

import { useCheckHasLoggedIn } from '@/hooks';

const DynamicSignUp = dynamic(
  () => import('@/components/molecules/Auth/SignUp').then((mod) => mod.SignUp),
  {
    ssr: true,
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
