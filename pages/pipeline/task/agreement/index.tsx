import Head from 'next/head';
import { FC } from 'react';

import { PipelineAgreementPage, PipelinePage } from '@/views';

const PipelineAgreementModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - Agreement</title>
      </Head>
      <PipelinePage scene={'pipeline'}>
        <PipelineAgreementPage />
      </PipelinePage>
    </>
  );
};

export default PipelineAgreementModule;
