import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicPipelineProfile = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineProfile').then(
      (mod) => mod.PipelineProfile,
    ),
  {
    ssr: true,
  },
);

export const PipelineProfilePage: FC = () => {
  return (
    <>
      <DynamicPipelineProfile />
    </>
  );
};
