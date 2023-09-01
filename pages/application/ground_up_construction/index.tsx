import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicGroundPage = dynamic(
  () =>
    import('@/views/Application/GroundPage/GroundPage').then(
      (mod) => mod.GroundPage,
    ),
  {
    ssr: true,
  },
);

const GroundUpConstruction: FC = () => {
  return <DynamicGroundPage />;
};

export default GroundUpConstruction;
