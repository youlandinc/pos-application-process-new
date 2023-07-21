import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicFixedAndFlipPage = dynamic(
  () =>
    import('@/views/Application/FixedAndFlipPage/FixedAndFlipPage').then(
      (mod) => mod.FixedAndFlipPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const FixedAndFlip: FC = () => {
  return <DynamicFixedAndFlipPage />;
};

export default FixedAndFlip;
