import { FC } from 'react';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { SignUp } from '@/components/molecules';
import { useCheckHasLoggedIn } from '@/hooks';

const SignUpPage: FC = observer((): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <Box>
      <SignUp />
    </Box>
  );
});

export default SignUpPage;
