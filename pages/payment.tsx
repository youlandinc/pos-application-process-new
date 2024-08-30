import type { NextPage } from 'next';
//import { SpecificalPaymentPage } from '@/views';
import Head from 'next/head';
import { useEffect } from 'react';
import router from 'next/router';

const PaymentPage: NextPage = () => {
  useEffect(() => {
    router.push('/');
  });
  return (
    <>
      <Head>
        <title>Appraisal Payment</title>
      </Head>
      {/*<SpecificalPaymentPage />*/}
    </>
  );
};

export default PaymentPage;
