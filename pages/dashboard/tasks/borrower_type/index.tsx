//import Head from 'next/head';
//import { FC } from 'react';
//import dynamic from 'next/dynamic';
//
//import { observer } from 'mobx-react-lite';
//
//const DynamicDashboardPage = dynamic(
//  () =>
//    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
//  {
//    ssr: true,
//  },
//);
//
//const DynamicBorrowerTypePage = dynamic(
//  () =>
//    import('@/views/Dashboard/TaskPage/BorrowerTypePage').then(
//      (mod) => mod.BorrowerTypePage,
//    ),
//  {
//    ssr: true,
//  },
//);
//const TaskBorrowerType: FC = observer(() => {
//  return (
//    <>
//      <Head>
//        <title>Tasks - Borrower Type</title>
//      </Head>
//      <DynamicDashboardPage>
//        <DynamicBorrowerTypePage />
//      </DynamicDashboardPage>
//    </>
//  );
//});
//
//export default TaskBorrowerType;
