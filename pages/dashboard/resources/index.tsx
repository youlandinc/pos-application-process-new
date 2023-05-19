import React, { FC } from 'react';
import { DashboardPage, ResourcesPage } from '@/views';

const Resources: FC = () => {
  return (
    <>
      <DashboardPage>
        <ResourcesPage />
      </DashboardPage>
    </>
  );
};

export default Resources;
