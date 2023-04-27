import { FC } from 'react';

import { PipelineListPage, PipelinePage } from '@/views';

const PipelineProfileModule: FC = () => {
  return (
    <PipelinePage>
      <PipelineListPage />
    </PipelinePage>
  );
};

export default PipelineProfileModule;
