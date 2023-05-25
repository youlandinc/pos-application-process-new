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

const DynamicTeamPage = dynamic(
  () => import('@/views/Dashboard/TeamPage').then((mod) => mod.TeamPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const Team: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicTeamPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Team;
