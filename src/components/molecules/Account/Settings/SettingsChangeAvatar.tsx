import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

export const SettingsChangeAvatar: FC = () => {
  return (
    <Stack border={'1px solid #D2D6E1'} borderRadius={2} gap={3} p={3}>
      <Typography variant={'h6'}>Avatar</Typography>
    </Stack>
  );
};
