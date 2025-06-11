import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicResetPassword = dynamic(
  () =>
    import('@/components/molecules/Auth/ResetPassword').then(
      (mod) => mod.ResetPassword,
    ),
  {
    ssr: true,
  },
);

const ResetPasswordPage: FC = observer((): JSX.Element => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <DynamicResetPassword />
    </>
  );
});

export default ResetPasswordPage;
