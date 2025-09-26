import { FC } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { useCheckOffMarketIsLogin } from '@/hooks';

const DynamicOffMarketDeals = dynamic(
  () =>
    import('@/components/molecules/OffMarket/OffMarketDeals').then(
      (mod) => mod.OffMarketDeals,
    ),
  {
    ssr: true,
  },
);

const OffMarketDealsPage: FC = observer(() => {
  useCheckOffMarketIsLogin();

  return (
    <>
      <Head>
        <title>Explore YouLand’s Off-Market deals</title>
      </Head>
      <DynamicOffMarketDeals />
    </>
  );
});

export default OffMarketDealsPage;
