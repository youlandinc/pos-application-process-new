import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicFixPage = dynamic(
  () =>
    import('@/views/Application/FixPage/FixPage').then((mod) => mod.FixPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const FixAndFlip: FC = () => {
  return <DynamicFixPage />;
};

export default FixAndFlip;
