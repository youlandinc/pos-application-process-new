import Head from 'next/head';
import type { NextPage } from 'next';

import { SpecificalPaymentPage } from '@/views';

const PaymentPage: NextPage = () => {
  return (
    <>
      <Head>
        <title key={'title'}>Appraisal Payment</title>
      </Head>
      <SpecificalPaymentPage />
    </>
  );
};

export default PaymentPage;
