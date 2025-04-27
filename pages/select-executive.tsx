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
        <meta content="Corepass Software Team" name="description" />
        <meta content="Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicSelectExecutivePage />
      </DynamicApplicationPage>
    </>
  );
});

export default CompensationInformationPage;
