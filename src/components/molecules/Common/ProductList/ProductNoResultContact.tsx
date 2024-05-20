import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { CallOutlined, MailOutlineOutlined } from '@mui/icons-material';

import { POSFormatUSPhoneToText } from '@/utils';
import { useSessionStorageState } from '@/hooks';

export const ProductNoResultContact: FC = () => {
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      gap={2.5}
      p={5}
      textAlign={'center'}
      width={'100%'}
    >
      <Typography color={'text.primary'} variant={'h6'}>
        No loan products available
      </Typography>

      <Typography color={'info.main'} variant={'body1'}>
        Adjust your information to find eligible products. If you have any
        questions, feel free to contact us.
      </Typography>

      <Stack
        alignItems={'center'}
        color={'info.main'}
        flexDirection={{ md: 'row', xs: 'column' }}
        fontWeight={600}
        gap={3}
        justifyContent={'center'}
        width={'100%'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'center'}
        >
          <CallOutlined />
          {POSFormatUSPhoneToText(saasState?.phone || '(833) 968-5263')}
        </Stack>
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'center'}
        >
          <MailOutlineOutlined />
          {saasState?.email || 'borrow@youland.com'}
        </Stack>
      </Stack>
    </Stack>
  );
};
