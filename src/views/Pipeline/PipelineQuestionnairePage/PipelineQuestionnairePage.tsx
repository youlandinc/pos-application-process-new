import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineQuestionnaire = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineQuestionnaire').then(
      (mod) => mod.PipelineQuestionnaire,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineQuestionnairePage: FC = () => {
  return (
    <>
      <DynamicPipelineQuestionnaire />
    </>
  );
};
