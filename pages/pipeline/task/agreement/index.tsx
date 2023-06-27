import { FC } from 'react';

import { PipelineAgreementPage, PipelinePage } from '@/views';

const PipelineAgreementModule: FC = () => {
  return (
    <PipelinePage>
      <PipelineAgreementPage />
    </PipelinePage>
  );
};

export default PipelineAgreementModule;
