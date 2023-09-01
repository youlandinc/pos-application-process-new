import { FC } from 'react';
import dynamic from 'next/dynamic';

const DynamicFixPage = dynamic(
  () =>
    import('@/views/Application/FixPage/FixPage').then((mod) => mod.FixPage),
  {
    ssr: true,
  },
);

const FixAndFlip: FC = () => {
  return <DynamicFixPage />;
};

export default FixAndFlip;
