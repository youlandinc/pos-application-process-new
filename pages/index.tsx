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
        <meta content="YouLand Software Team" name="description" />
        <meta content="YouLand Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicStartingQuestionPage />
      </DynamicApplicationPage>
    </>
  );
});

export default Index;
