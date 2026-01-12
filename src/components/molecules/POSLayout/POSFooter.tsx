import { FC } from 'react';
import { Icon, Stack } from '@mui/material';

import ICON_BRAND from './assets/icon_brand.svg';

export const POSFooter: FC = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        px: 'clamp(24px,2.5vw,48px)',
        pb: 'clamp(24px,2.5vw,48px)',
        pt: {
          md: 0,
          xs: 31.5,
        },
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: {
          md: 'unset',
          xs: 'center',
        },
      }}
    >
      <Icon
        component={ICON_BRAND}
        sx={{
          height: 16,
          width: 167,
        }}
      />
    </Stack>
  );
};
