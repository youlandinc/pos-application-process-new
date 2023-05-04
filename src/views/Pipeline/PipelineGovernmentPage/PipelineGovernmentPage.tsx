import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineGovernment = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineGovernment').then(
      (mod) => mod.PipelineGovernment,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

export const PipelineGovernmentPage: FC = () => {
  return (
    <>
      <DynamicPipelineGovernment />
    </>
  );
};
