import { FC } from 'react';
import { DashboardPage, RatesPage } from '@/views';

const Rates: FC = () => {
  return (
    <>
      <DashboardPage>
        <RatesPage />
      </DashboardPage>
    </>
  );
};

export default Rates;
