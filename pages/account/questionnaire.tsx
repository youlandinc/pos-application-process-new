import Head from 'next/head';
import { FC } from 'react';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicAccountPage = dynamic(
  () => import('@/views/Account/AccountPage').then((mod) => mod.AccountPage),
  {
    ssr: true,
  },
);

const DynamicAccountQuestionnairePage = dynamic(
  () =>
    import('@/views/Account/Qualification/QuestionnairePage').then(
      (mod) => mod.QuestionnairePage,
    ),
  {
    ssr: true,
  },
);

const QualificationQuestionnairePage: FC = observer(() => {
  return (
    <>
      <Head>
        <title>Questionnaire Information</title>
      </Head>
      <DynamicAccountPage>
        <DynamicAccountQuestionnairePage />
      </DynamicAccountPage>
    </>
  );
});

export default QualificationQuestionnairePage;
