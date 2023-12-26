import Head from 'next/head';
import { FC } from 'react';

import { PipelinePage, PipelineQuestionnairePage } from '@/views';

const PipelineQuestionnaireModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - Questionnaire</title>
      </Head>
      <PipelinePage scene={'pipeline'}>
        <PipelineQuestionnairePage />
      </PipelinePage>
    </>
  );
};

export default PipelineQuestionnaireModule;
