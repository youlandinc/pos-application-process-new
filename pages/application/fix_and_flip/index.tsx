import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicFixPage = dynamic(
  () =>
    import('@/views/Application/FixPage/FixPage').then((mod) => mod.FixPage),
  {
    ssr: true,
  },
);

const FixAndFlip: FC = () => {
  return (
    <>
      <Head>
        <title>Apply for a fix and flip loan</title>
      </Head>
      <DynamicFixPage />
    </>
  );
};

export default FixAndFlip;
