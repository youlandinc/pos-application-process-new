import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineProfile = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineProfile').then(
      (mod) => mod.PipelineProfile,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineProfilePage: FC = () => {
  return (
    <>
      <DynamicPipelineProfile />
    </>
  );
};
