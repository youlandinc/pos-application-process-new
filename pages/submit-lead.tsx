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

const DynamicSubmitLeadPage = dynamic(
  () =>
    import('@/views/Application/SubmitLeadPage').then(
      (mod) => mod.SubmitLeadPage,
    ),
  {
    ssr: true,
  },
);

const SubmitLeadPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicSubmitLeadPage />
      </DynamicApplicationPage>
    </>
  );
});

export default SubmitLeadPage;
