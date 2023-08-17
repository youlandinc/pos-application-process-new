import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicGroundPage = dynamic(
  () =>
    import('@/views/Application/GroundPage/GroundPage').then(
      (mod) => mod.GroundPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const GroundUpConstruction: FC = () => {
  return <DynamicGroundPage />;
};

export default GroundUpConstruction;
