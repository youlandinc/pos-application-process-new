import type { NextPage } from 'next';
import { SaasDocumentPortalPage } from '@/views';
import Head from 'next/head';

const DocumentPortalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Document portal</title>
      </Head>
      <SaasDocumentPortalPage />
    </>
  );
};

export default DocumentPortalPage;
