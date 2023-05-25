import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicOverviewPage = dynamic(
  () =>
    import('@/views/Dashboard/OverviewPage').then((mod) => mod.OverviewPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const Overview: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicOverviewPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Overview;
