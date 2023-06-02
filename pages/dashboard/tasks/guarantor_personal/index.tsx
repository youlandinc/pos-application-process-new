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

const DynamicGuarantorPersonalPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/GuarantorPersonalPage').then(
      (mod) => mod.GuarantorPersonalPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const TaskGuarantorPersonal: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicGuarantorPersonalPage />
      </DynamicDashboardPage>
    </>
  );
});

export default TaskGuarantorPersonal;
