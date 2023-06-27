import { FC } from 'react';
import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components/atoms';

const DynamicPipelineLicense = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineLicense').then(
      (mod) => mod.PipelineLicense,
    ),
  {
    loading: () => <StyledLoading />,
    ssr: false,
  },
);

export const PipelineLicensePage: FC = () => {
  return (
    <>
      <DynamicPipelineLicense />
    </>
  );
};
