import dynamic from 'next/dynamic';

import { StyledLoading } from '@/components/atoms';

const DynamicEntrance = dynamic(
  () => import('@/components/organisms/Entrance').then((mod) => mod.Entrance),
  {
    loading: () => <StyledLoading sx={{ color: 'black' }} />,
    ssr: false,
  },
);
export const EntrancePage = () => {
  return (
    <>
      <DynamicEntrance />
    </>
  );
};
