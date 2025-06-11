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

const DynamicLoanInformationPage = dynamic(
  () =>
    import('@/views/Application/LoanInformationPage').then(
      (mod) => mod.LoanInformationPage,
    ),
  {
    ssr: true,
  },
);

const LoanInformationPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicLoanInformationPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanInformationPage;
