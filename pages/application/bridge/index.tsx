import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicBridgePage = dynamic(
  () =>
    import('@/views/Application/BridgePage/BridgePage').then(
      (mod) => mod.BridgePage,
    ),
  {
    ssr: true,
  },
);

const Bridge: FC = () => {
  return (
    <>
      <Head>
        <title>Apply for a bridge loan</title>
      </Head>
      <DynamicBridgePage />
    </>
  );
};

export default Bridge;
