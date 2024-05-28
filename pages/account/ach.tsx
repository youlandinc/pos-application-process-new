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

const DynamicAccountACHPage = dynamic(
  () =>
    import('@/views/Account/Qualification/ACHPage').then((mod) => mod.ACHPage),
  {
    ssr: true,
  },
);

const QualificationACHPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>ACH Information</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountACHPage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationACHPage;
