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
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicPipelineListPage = dynamic(
  () =>
    import('@/views/Pipeline/PipelinePage/PipelinePage').then(
      (mod) => mod.PipelinePage,
    ),
  {
    loading: () => <CircularProgress />,
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
