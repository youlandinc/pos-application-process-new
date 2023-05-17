import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);

const DynamicRatesPage = dynamic(
  () => import('@/views/Dashboard/RatesPage').then((mod) => mod.RatesPage),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  },
);
const Rates: FC = observer(() => {
  return (
    <>
      <DynamicDashboardPage>
        <DynamicRatesPage />
      </DynamicDashboardPage>
    </>
  );
});

export default Rates;
