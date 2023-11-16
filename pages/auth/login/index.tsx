import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { useCheckHasLoggedIn } from '@/hooks';

const DynamicLogin = dynamic(
  () => import('@/components/molecules/Auth/Login').then((mod) => mod.Login),
  {
    ssr: true,
  },
);

const LoginPage: FC = observer((): JSX.Element => {
  useCheckHasLoggedIn();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <DynamicLogin to={'/pipeline'} />
    </>
  );
});

export default LoginPage;
