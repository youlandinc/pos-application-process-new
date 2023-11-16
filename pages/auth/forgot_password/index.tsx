import Head from 'next/head';
import { FC } from 'react';
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
    <>
      <Head>
        <title>Forgot password</title>
      </Head>
      <DynamicForgotPasswordPage />
    </>
  );
});

export default ForgotPasswordPage;
