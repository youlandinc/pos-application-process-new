import { FC } from 'react';

import { PipelinePage, PipelineQuestionnairePage } from '@/views';

const PipelineQuestionnaireModule: FC = () => {
  return (
    <PipelinePage>
      <PipelineQuestionnairePage />
    </PipelinePage>
  );
};

export default PipelineQuestionnaireModule;
