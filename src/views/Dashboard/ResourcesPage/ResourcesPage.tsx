import { FC } from 'react';
import { PageHeader } from '@/components/molecules';

export const ResourcesPage: FC = () => {
  return (
    <PageHeader
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
