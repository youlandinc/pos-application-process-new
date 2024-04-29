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
//const DynamicLoanDetailsPage = dynamic(
//  () =>
//    import('@/views/Dashboard/TaskPage/LoanDetailsPage').then(
//      (mod) => mod.LoanDetailsPage,
//    ),
//  {
//    ssr: true,
//  },
//);
//const TaskLoanDetails: FC = observer(() => {
//  return (
//    <>
//      <Head>
//        <title>Tasks - Loan Details</title>
//      </Head>
//      <DynamicDashboardPage>
//        <DynamicLoanDetailsPage />
//      </DynamicDashboardPage>
//    </>
//  );
//});
//
//export default TaskLoanDetails;
