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

const DynamicAccountW9FormPage = dynamic(
  () =>
    import('@/views/Account/Qualification/W9FormPage').then(
      (mod) => mod.W9FormPage,
    ),
  {
    ssr: true,
  },
);

const QualificationW9FormPage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>W9 Form</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountW9FormPage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationW9FormPage;
