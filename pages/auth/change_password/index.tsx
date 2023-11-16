import Head from 'next/head';
import { FC } from 'react';
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
    <>
      <Head>
        <title>Change password</title>
      </Head>
      <DynamicChangePassword />
    </>
  );
});

export default ChangePasswordPage;
