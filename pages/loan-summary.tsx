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

const DynamicLoanSummaryPage = dynamic(
  () =>
    import('@/views/Application/LoanSummaryPage').then(
      (mod) => mod.LoanSummaryPage,
    ),
  {
    ssr: true,
  },
);

const LoanSummaryPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicLoanSummaryPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanSummaryPage;
