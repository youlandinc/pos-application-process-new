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
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicLoanSummaryPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanSummaryPage;
