import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicInvestmentExperiencePage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/InvestmentExperiencePage').then(
      (mod) => mod.InvestmentExperiencePage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskInvestmentExperience: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicInvestmentExperiencePage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskInvestmentExperience;
