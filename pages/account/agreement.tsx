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

const DynamicAccountAgreementPage = dynamic(
  () =>
    import('@/views/Account/Qualification/AgreementPage').then(
      (mod) => mod.AgreementPage,
    ),
  {
    ssr: true,
  },
);

const QualificationACHPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Agreement Info</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountAgreementPage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationACHPage;
