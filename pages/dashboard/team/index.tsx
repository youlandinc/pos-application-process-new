import Head from 'next/head';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicTeamPage = dynamic(
  () => import('@/views/Dashboard/TeamPage').then((mod) => mod.TeamPage),
  {
    ssr: true,
  },
);

const Team: FC = observer(() => {
  return (
    <>
      <Head>
        <title>My Team</title>
      </Head>
      <DynamicDashboardPage>
        <DynamicTeamPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Team;
