import { FC } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';

import { LayoutSceneTypeEnum } from '@/types';
import { _readAllMessage } from '@/requests';

const DynamicPipelinePage = dynamic(
  () => import('@/views/Pipeline/PipelinePage').then((mod) => mod.PipelinePage),
  {
    ssr: true,
  },
);

const DynamicPipelineListPage = dynamic(
  () =>
    import('@/views/Pipeline/PipelineListPage').then(
      (mod) => mod.PipelineListPage,
    ),
  {
    ssr: true,
  },
);

const PipelinePage: FC = observer(() => {
  const router = useRouter();
  //const store = useMst();

  useAsync(async () => {
    const { type, loanId, fileId, categoryKey, fileName } = POSGetParamsFromUrl(
      location.href,
    );

    if (!type || !loanId || !fileId || !categoryKey || !fileName) {
      return;
    }

    //store.setNotificationDocument({
    //  categoryKey,
    //  fileId: +fileId,
    //  fileName,
    //});

    if (type === 'comment') {
      await _readAllMessage({ fileId });

      await router.push({
        pathname: '/dashboard/documents',
        query: {
          loanId,
        },
      });
    }
  }, [location.href]);

  return (
    <>
      <Head>
        <title>My loans</title>
      </Head>
      <DynamicPipelinePage scene={LayoutSceneTypeEnum.pipeline_without_all}>
        <DynamicPipelineListPage />
      </DynamicPipelinePage>
    </>
  );
});

export default PipelinePage;
