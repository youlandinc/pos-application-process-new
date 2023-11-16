import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicGroundPage = dynamic(
  () =>
    import('@/views/Application/GroundPage/GroundPage').then(
      (mod) => mod.GroundPage,
    ),
  {
    ssr: true,
  },
);

const GroundUpConstruction: FC = () => {
  return (
    <>
      <Head>
        <title>Apply for a construction loan</title>
      </Head>
      <DynamicGroundPage />
    </>
  );
};

export default GroundUpConstruction;
