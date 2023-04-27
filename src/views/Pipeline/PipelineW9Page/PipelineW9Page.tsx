import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineW9 = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipeLineW9').then(
      (mod) => mod.Pipeline,
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
