import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicPipelineGovernment = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineGovernment').then(
      (mod) => mod.PipelineGovernment,
    ),
  {
    ssr: true,
  },
);

export const PipelineGovernmentPage: FC = () => {
  return (
    <>
      <DynamicPipelineGovernment />
    </>
  );
};
