//import Head from 'next/head';
//import { FC } from 'react';
//import { observer } from 'mobx-react-lite';
//import dynamic from 'next/dynamic';
//
//const DynamicDashboardPage = dynamic(
//  () =>
//    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
//  {
//    ssr: true,
//  },
//);
//
//const DynamicUploadPicturesPage = dynamic(
//  () =>
//    import('@/views/Dashboard/TaskPage/UploadPicturesPage').then(
//      (mod) => mod.UploadPicturesPage,
//    ),
//  {
//    ssr: true,
//  },
//);
//const TaskUploadPictures: FC = observer(() => {
//  return (
//    <>
//      <Head>
//        <title>Tasks - Upload Photos</title>
//      </Head>
//      <DynamicDashboardPage>
//        <DynamicUploadPicturesPage />
//      </DynamicDashboardPage>
//    </>
//  );
//});
//
//export default TaskUploadPictures;
