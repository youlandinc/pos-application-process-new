import { FC } from 'react';
import { DashboardHeader } from '@/components/molecules';

export const ResourcesPage: FC = () => {
  return (
    <DashboardHeader
      sx={{
        px: {
          lg: 3,
          xs: 0,
        },
        maxWidth: 900,
        mx: {
          lg: 'auto',
          xs: 0,
        },
      }}
      title={
        'Still in development, I have opened our official website corresponding to content.'
      }
    />
  );
};
