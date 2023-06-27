import { FC } from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

import { observer } from 'mobx-react-lite';

const DynamicPipelinePage = dynamic(
  () =>
    import('@/views/Pipeline/PipelinePage/PipelinePage').then(
      (mod) => mod.PipelinePage,
    ),
  {
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 375,
          minHeight: 667,
        }}
      >
        <CircularProgress />
      </div>
    ),
    ssr: false,
  },
);

const DynamicPipelineListPage = dynamic(
  () =>
    import('@/views/Pipeline/PipelineListPage/PipelineListPage').then(
      (mod) => mod.PipelineListPage,
    ),
  {
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: 375,
          minHeight: 667,
        }}
      >
        <CircularProgress />
      </div>
    ),
    ssr: false,
  },
);

const PipelineProfileModule: FC = observer(() => {
  return (
    <DynamicPipelinePage>
      <DynamicPipelineListPage />
    </DynamicPipelinePage>
  );
});

export default PipelineProfileModule;
