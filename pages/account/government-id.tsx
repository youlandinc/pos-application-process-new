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

const DynamicAccountGovernmentPage = dynamic(
  () =>
    import('@/views/Account/Qualification/GovernmentIDPage').then(
      (mod) => mod.GovernmentIDPage,
    ),
  {
    ssr: true,
  },
);

const QualificationGovernmentPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Government ID</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountGovernmentPage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationGovernmentPage;
