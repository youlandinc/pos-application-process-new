import { FC } from 'react';

import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { useCheckOffMarketLogIn } from '@/hooks';

const DynamicOffMarketLogin = dynamic(() =>
  import('@/components/molecules/OffMarket/OffMarketLogin').then(
    (mod) => mod.OffMarketLogin,
  ),
);

const OffMarketLoginPage: FC = observer(() => {
  useCheckOffMarketLogIn();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <DynamicOffMarketLogin to={'/off-market-deals'} />
    </>
  );
});

export default OffMarketLoginPage;
