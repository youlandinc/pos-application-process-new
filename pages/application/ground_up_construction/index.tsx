import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicGroundUpPage = dynamic(
  () =>
    import('@/views/Application/GroundUpPage/GroundUpPage').then(
      (mod) => mod.GroundUpPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const GroundUpConstruction: FC = () => {
  return <DynamicGroundUpPage />;
};

export default GroundUpConstruction;
