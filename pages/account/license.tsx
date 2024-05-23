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

const DynamicAccountLicensePage = dynamic(
  () =>
    import('@/views/Account/Qualification/LicensePage').then(
      (mod) => mod.LicensePage,
    ),
  {
    ssr: true,
  },
);

const QualificationLicensePage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>ACH Information</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountLicensePage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationLicensePage;
