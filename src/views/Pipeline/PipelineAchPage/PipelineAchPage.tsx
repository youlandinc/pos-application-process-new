import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineW9 = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineAch').then(
      (mod) => mod.PipelineAch,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineAchPage: FC = () => {
  return (
    <>
      <DynamicPipelineW9 />
    </>
  );
};
