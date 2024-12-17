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
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicLoanInformationPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanInformationPage;
