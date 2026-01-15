import { FC } from 'react';
import { Icon, Stack } from '@mui/material';

import ICON_BRAND from './icon_brand.svg';

export const StyledBrand: FC = () => {
  return (
    <Stack
      sx={{
        width: '100%',
        px: 3,
        pb: 3,
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
          height: 12,
          width: 167,
        }}
      />
    </Stack>
  );
};
