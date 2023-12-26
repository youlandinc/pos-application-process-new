import Head from 'next/head';
import { FC } from 'react';

import { PipelinePage, PipelineProfilePage } from '@/views';

const PipelineModule: FC = () => {
  return (
    <>
      <Head>
        <title>Pipeline - Tasks</title>
      </Head>
      <PipelinePage scene={'pipeline'}>
        <PipelineProfilePage />
      </PipelinePage>
    </>
  );
};

export default PipelineModule;
