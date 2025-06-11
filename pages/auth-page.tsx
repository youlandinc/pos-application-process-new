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

const DynamicAuthPage = dynamic(
  () => import('@/views/Application/AuthPage').then((mod) => mod.AuthPage),
  {
    ssr: true,
  },
);

const AuthPage = observer(() => {
  return (
    <>
      <Head>
        <title>Apply for a loan</title>
      </Head>
      <DynamicApplicationPage>
        <DynamicAuthPage />
      </DynamicApplicationPage>
    </>
  );
});

export default AuthPage;
