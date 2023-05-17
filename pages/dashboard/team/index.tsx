import { FC } from 'react';
import { DashboardPage, TeamPage } from '@/views';

const Team: FC = () => {
  return (
    <>
      <DashboardPage>
        <TeamPage />
      </DashboardPage>
    </>
  );
};

export default Team;
