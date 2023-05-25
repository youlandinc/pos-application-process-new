import { FC } from 'react';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicBridgePage = dynamic(
  () =>
    import('@/views/Application/BridgePage/BridgePage').then(
      (mod) => mod.BridgePage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const Bridge: FC = () => {
  return <DynamicBridgePage />;
};

export default Bridge;
