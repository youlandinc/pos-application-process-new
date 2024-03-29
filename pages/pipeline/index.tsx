import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicPipelinePage = dynamic(
  () =>
    import('@/views/Pipeline/PipelinePage/PipelinePage').then(
      (mod) => mod.PipelinePage,
    ),
  {
    ssr: true,
  },
);

const DynamicPipelineListPage = dynamic(
  () =>
    import('@/views/Pipeline/PipelineListPage/PipelineListPage').then(
      (mod) => mod.PipelineListPage,
    ),
  {
    ssr: true,
  },
);

const PipelineProfileModule: FC = observer(() => {
  return (
    <>
      <Head>
        <title>My loans</title>
      </Head>
      <DynamicPipelinePage scene={'pipeline_without_all'}>
        <DynamicPipelineListPage />
      </DynamicPipelinePage>
    </>
  );
});

export default PipelineProfileModule;
