import { FC } from 'react';
import Head from 'next/head';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

import { useCheckOffMarketLogIn } from '@/hooks';

const DynamicOffMarketSignUp = dynamic(
  () =>
    import('@/components/molecules/OffMarket/OffMarketSignUp').then(
      (mod) => mod.OffMarketSignUp,
    ),
  {
    ssr: true,
  },
);

const OffMarketSignUpPage: FC = observer((): JSX.Element => {
  useCheckOffMarketLogIn();

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <DynamicOffMarketSignUp isRedirect={false} />
    </>
  );
});

export default OffMarketSignUpPage;
