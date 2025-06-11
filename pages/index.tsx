import Head from 'next/head';
import dynamic from 'next/dynamic';

import { observer } from 'mobx-react-lite';

const DynamicApplicationPage = dynamic(
  () =>
    import('@/views/Application/ApplicationPage').then(
      (mod) => mod.ApplicationPage,
    ),
  {
    ssr: true,
  },
);

const DynamicStartingQuestionPage = dynamic(
  () =>
    import('@/views/Application/StartingQuestionPage').then(
      (mod) => mod.StartingQuestionPage,
    ),
  {
    ssr: true,
  },
);

const Index = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicStartingQuestionPage />
      </DynamicApplicationPage>
    </>
  );
});

export default Index;
