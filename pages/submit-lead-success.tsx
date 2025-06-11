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

const DynamicEstimateRatePage = dynamic(
  () =>
    import('@/views/Application/SubmitLeadSuccessPage').then(
      (mod) => mod.SubmitLeadSuccessPage,
    ),
  {
    ssr: true,
  },
);

const SubmitLeadSuccessPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicEstimateRatePage />
      </DynamicApplicationPage>
    </>
  );
});

export default SubmitLeadSuccessPage;
