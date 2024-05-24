import type { NextPage } from 'next';
import { SpecificalPaymentPage } from '@/views';
import Head from 'next/head';

const PaymentPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Appraisal Payment</title>
      </Head>
      <SpecificalPaymentPage />
    </>
  );
};

export default PaymentPage;
