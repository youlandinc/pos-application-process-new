import Head from 'next/head';
import { FC } from 'react';

import { PipelineGovernmentPage, PipelinePage } from '@/views';

const PipelineGovernmentModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - Government ID</title>
      </Head>
      <PipelinePage scene={'pipeline'}>
        <PipelineGovernmentPage />
      </PipelinePage>
    </>
  );
};

export default PipelineGovernmentModule;
