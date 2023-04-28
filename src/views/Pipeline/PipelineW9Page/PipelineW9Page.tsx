import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineW9 = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineW9').then(
      (mod) => mod.PipelineW9,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

export const PipelineW9Page: FC = () => {
  return (
    <>
      <DynamicPipelineW9 />
    </>
  );
};
