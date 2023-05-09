import { FC } from 'react';
import { DashboardPage, OverviewPage } from '@/views';

const Overview: FC = () => {
  return (
    <>
      <DashboardPage>
        <OverviewPage />
      </DashboardPage>
    </>
  );
};

export default Overview;
