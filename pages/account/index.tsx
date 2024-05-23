import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicAccountPage = dynamic(
  () => import('@/views/Account/AccountPage').then((mod) => mod.AccountPage),
  {
    ssr: true,
  },
);

const DynamicAccountSettings = dynamic(
  () =>
    import('@/views/Account/AccountSettingsPage').then(
      (mod) => mod.AccountSettingsPage,
    ),
  {
    ssr: true,
  },
);

const AccountSettingsPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>My account</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountSettings />
      </DynamicAccountPage>
    </>
  );
});

export default AccountSettingsPage;
