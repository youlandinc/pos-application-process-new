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
    <DynamicPipelinePage>
      <DynamicPipelineListPage />
    </DynamicPipelinePage>
  );
});

export default PipelineProfileModule;
