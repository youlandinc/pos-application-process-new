import { FC } from 'react';

import { PipelineList, PipelinePage } from '@/views';

const PipelineModule: FC = () => {
  return (
    <PipelinePage>
      <PipelineList />
    </PipelinePage>
  );
};

export default PipelineModule;
