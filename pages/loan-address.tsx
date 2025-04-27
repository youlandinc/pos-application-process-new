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

const DynamicLoanAddressPage = dynamic(
  () =>
    import('@/views/Application/LoanAddressPage').then(
      (mod) => mod.LoanAddressPage,
    ),
  {
    ssr: true,
  },
);

const LoanAddressPage = observer(() => {
  return (
    <>
      <Head>
        <meta content="Corepass Software Team" name="description" />
        <meta content="Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicLoanAddressPage />
      </DynamicApplicationPage>
    </>
  );
});

export default LoanAddressPage;
