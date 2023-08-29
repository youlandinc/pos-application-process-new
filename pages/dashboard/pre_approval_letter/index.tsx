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

const DynamicPreApprovalLetterPage = dynamic(
  () =>
    import('@/views/Dashboard/PreApprovalLetterPage').then(
      (mod) => mod.PreApprovalLetterPage,
    ),
  {
    ssr: true,
  },
);

const PreApprovalLetter: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicPreApprovalLetterPage />
      </DynamicDashboardPage>
    </>
  );
});

export default PreApprovalLetter;
