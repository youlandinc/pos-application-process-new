import Head from 'next/head';
import { FC } from 'react';
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
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <DynamicSignUp isRedirect={false} />
    </>
  );
});

export default SignUpPage;
