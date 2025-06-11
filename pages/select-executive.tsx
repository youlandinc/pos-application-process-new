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

const DynamicSelectExecutivePage = dynamic(
  () =>
    import('@/views/Application/SelectExecutivePage').then(
      (mod) => mod.SelectExecutivePage,
    ),
  {
    ssr: true,
  },
);

const CompensationInformationPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicSelectExecutivePage />
      </DynamicApplicationPage>
    </>
  );
});

export default CompensationInformationPage;
