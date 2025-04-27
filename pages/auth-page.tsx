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
        <meta content="Corepass Software Team" name="description" />
        <meta content="Point Of Sales System" name="keywords" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DynamicApplicationPage>
        <DynamicAuthPage />
      </DynamicApplicationPage>
    </>
  );
});

export default AuthPage;
