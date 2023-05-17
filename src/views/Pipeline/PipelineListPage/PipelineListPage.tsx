import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineList = dynamic(
  () =>
    import('@/components/organisms/Pipeline/Pipeline').then(
      (mod) => mod.Pipeline,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineListPage: FC = () => {
  return (
    <>
      <DynamicPipelineList />
    </>
  );
};
