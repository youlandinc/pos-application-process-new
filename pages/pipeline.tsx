import { FC } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';

import { LayoutSceneTypeEnum, LinkFromOutEnum } from '@/types';

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
  const store = useMst();
  const { session } = store;

  useAsync(async () => {
    const { type, loanId } = POSGetParamsFromUrl(location.href);

    if (!type || !loanId || !session) {
      return;
    }

    switch (type) {
      case LinkFromOutEnum.file_comment:
        store.updateNotificationVisible(true);

        await router.push({
          pathname: '/dashboard/overview',
          query: {
            loanId,
          },
        });
        break;
      case LinkFromOutEnum.upload_file:
        store.updateNotificationVisible(false);

        await router.push({
          pathname: '/dashboard/documents',
          query: {
            loanId,
          },
        });
        break;
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
