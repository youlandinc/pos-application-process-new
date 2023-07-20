import { FC } from 'react';
import { CallOutlined, MailOutlineOutlined } from '@mui/icons-material';
import { Icon, Stack, Typography } from '@mui/material';

import RATE_NO_RESULT from '@/svg/dashboard/rate_no_result.svg';

export const RatesSearchNoResult: FC = () => {
  return (
    <>
      <Stack
        alignItems={'center'}
        gap={3}
        justifyContent={'center'}
        maxWidth={900}
        mb={3}
        mt={6}
        width={'100%'}
      >
        <Icon component={RATE_NO_RESULT} sx={{ width: 260, height: 220 }} />
        <Typography color={'text.primary'} textAlign={'center'} variant={'h4'}>
          Can&apos;t find any rates? We can help
        </Typography>
        <Typography color={'info.main'} textAlign={'center'} variant={'body1'}>
          Based on your information, we couldn&apos;t find any options. Feel
          free to contact us and we&apos;ll help you out.
        </Typography>
        <Stack
          alignItems={'center'}
          flexDirection={{ md: 'row', xs: 'column' }}
          gap={3}
          justifyContent={'center'}
          maxWidth={900}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'center'}
          >
            <CallOutlined />
            (833) 968-5263
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'center'}
          >
            <MailOutlineOutlined />
            borrow@youland.com
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
