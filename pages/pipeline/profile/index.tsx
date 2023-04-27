import { FC } from 'react';

import { PipelinePage, PipelineProfilePage } from '@/views';

const PipelineModule: FC = () => {
  return (
    <PipelinePage>
      <PipelineProfilePage />
    </PipelinePage>
  );
};

export default PipelineModule;
