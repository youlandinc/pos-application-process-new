import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineTable = dynamic(
  () =>
    import('@/components/organisms/Pipeline/Pipeline').then(
      (mod) => mod.Pipeline,
    ),
  {
    loading: () => <StyledLoading />,
  },
);

export const PipelineList: FC = () => {
  return (
    <>
      <DynamicPipelineTable />
    </>
  );
};
