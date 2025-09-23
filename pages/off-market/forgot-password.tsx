import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicOffMarketForgotPasswordPage = dynamic(
  () =>
    import('@/components/molecules/OffMarket/OffMarketForgotPassword').then(
      (mod) => mod.OffMarketForgotPassword,
    ),
  {
    ssr: true,
  },
);

const OffMarketForgotPasswordPage: FC = observer((): JSX.Element => {
  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <DynamicOffMarketForgotPasswordPage />
    </>
  );
});

export default OffMarketForgotPasswordPage;
