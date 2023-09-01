import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicPipelineLicense = dynamic(
  () =>
    import('@/components/organisms/Pipeline/PipelineLicense').then(
      (mod) => mod.PipelineLicense,
    ),
  {
    ssr: true,
  },
);

export const PipelineLicensePage: FC = () => {
  return (
    <>
      <DynamicPipelineLicense />
    </>
  );
};
