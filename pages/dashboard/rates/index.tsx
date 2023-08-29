import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';

const DynamicDashboardPage = dynamic(
  () =>
    import('@/views/Dashboard/DashboardPage').then((mod) => mod.DashboardPage),
  {
    ssr: true,
  },
);

const DynamicRatesPage = dynamic(
  () => import('@/views/Dashboard/RatesPage').then((mod) => mod.RatesPage),
  {
    ssr: true,
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
