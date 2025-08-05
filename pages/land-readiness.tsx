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

const DynamicLandReadinessPage = dynamic(
  () =>
    import('@/views/Application/LandReadinessPage').then(
      (mod) => mod.LandReadinessPage,
    ),
  {
    ssr: true,
  },
);

const LoanAddressPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicLandReadinessPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanAddressPage;
