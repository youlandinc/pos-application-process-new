import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components';

const DynamicPipelineW9 = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineAgreement').then(
      (mod) => mod.PipelineAgreement,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineAgreementPage: FC = () => {
  return (
    <>
      <DynamicPipelineW9 />
    </>
  );
};
