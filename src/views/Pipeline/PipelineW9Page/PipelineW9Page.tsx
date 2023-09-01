import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicPipelineW9 = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineW9').then(
      (mod) => mod.PipelineW9,
    ),
  {
    ssr: true,
  },
);

export const PipelineW9Page: FC = () => {
  return (
    <>
      <DynamicPipelineW9 />
    </>
  );
};
