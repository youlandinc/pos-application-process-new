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

const DynamicUploadPicturesPage = dynamic(
  () =>
    import('@/views/Dashboard/TaskPage/UploadPicturesPage').then(
      (mod) => mod.UploadPicturesPage,
    ),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const Task: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicUploadPicturesPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Task;
