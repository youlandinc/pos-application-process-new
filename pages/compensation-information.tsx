import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicApplicationPage = dynamic(
  () =>
    import('@/views/Application/ApplicationPage').then(
      (mod) => mod.ApplicationPage,
    ),
  {
    ssr: true,
  },
);

const DynamicCompensationInformationPage = dynamic(
  () =>
    import('@/views/Application/CompensationInformationPage').then(
      (mod) => mod.CompensationInformationPage,
    ),
  {
    ssr: true,
  },
);

const CompensationInformationPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicCompensationInformationPage />
      </DynamicApplicationPage>
    </>
  );
});

export default CompensationInformationPage;
