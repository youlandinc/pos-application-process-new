import Head from 'next/head';
import type { NextPage } from 'next';

import { SubscriptionPayment } from '@/views';

const SubscriptionPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Subscription Payment</title>
      </Head>
      <SubscriptionPayment />
    </>
  );
};

export default SubscriptionPage;
