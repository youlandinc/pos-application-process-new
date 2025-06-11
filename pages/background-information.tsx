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

const DynamicBackgroundInformationPage = dynamic(
  () =>
    import('@/views/Application/BackgroundInformationPage').then(
      (mod) => mod.BackgroundInformationPage,
    ),
  {
    ssr: true,
  },
);

const BackgroundInformationPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicBackgroundInformationPage />
      </DynamicApplicationPage>
    </>
  );
});

export default BackgroundInformationPage;
