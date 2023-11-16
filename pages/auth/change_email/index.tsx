import Head from 'next/head';
import { FC } from 'react';
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
    <>
      <Head>
        <title>Change email</title>
      </Head>
      <DynamicChangeEmail />
    </>
  );
});

export default ChangeEmailPage;
