import Head from 'next/head';
import { FC } from 'react';

import { PipelinePage, PipelineW9Page } from '@/views';

const PipelineW9Module: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - W9 Form</title>
      </Head>
      <PipelinePage>
        <PipelineW9Page />
      </PipelinePage>
    </>
  );
};

export default PipelineW9Module;
