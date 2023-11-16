import Head from 'next/head';
import { FC } from 'react';

import { PipelineLicensePage, PipelinePage } from '@/views';

const PipelineLicenseModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - License</title>
      </Head>
      <PipelinePage>
        <PipelineLicensePage />
      </PipelinePage>
    </>
  );
};

export default PipelineLicenseModule;
