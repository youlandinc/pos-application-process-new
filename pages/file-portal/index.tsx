import type { NextPage } from 'next';
import { SaasDocumentPortalPage } from '@/views';
import Head from 'next/head';

const FilePortalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>File portal</title>
      </Head>
      <SaasDocumentPortalPage />
    </>
  );
};

export default FilePortalPage;
