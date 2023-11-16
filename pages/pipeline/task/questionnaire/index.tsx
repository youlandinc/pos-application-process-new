import Head from 'next/head';
import { FC } from 'react';

import { PipelinePage, PipelineQuestionnairePage } from '@/views';

const PipelineQuestionnaireModule: FC = () => {
  return (
    <>
      <Head>
        <title>Tasks - Questionnaire</title>
      </Head>
      <PipelinePage>
        <PipelineQuestionnairePage />
      </PipelinePage>
    </>
  );
};

export default PipelineQuestionnaireModule;
