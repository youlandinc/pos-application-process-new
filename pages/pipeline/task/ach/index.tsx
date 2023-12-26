import Head from 'next/head';
import { FC } from 'react';

import { PipelineAchPage, PipelinePage } from '@/views';

const PipelineAchModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - ACH Information</title>
      </Head>
      <PipelinePage scene={'pipeline'}>
        <PipelineAchPage />
      </PipelinePage>
    </>
  );
};

export default PipelineAchModule;
