import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { MailOutlineOutlined, PhoneEnabledOutlined } from '@mui/icons-material';

import { POSFormatUSPhoneToText } from '@/utils';
import { TeamMemberData } from '@/views';

interface DashboardServiceCardItemProps {
  data: TeamMemberData;
}

export const DashboardServiceCardItem: FC<DashboardServiceCardItemProps> = ({
  data: { name, avatar, email, phone, title, position },
}) => {
  return (
    <Stack
      alignItems={{ xs: 'flex-start', md: 'center' }}
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={{ xs: 3, md: 6 }}
      p={3}
      width={'100%'}
    >
      <Stack
        flexShrink={0}
        height={{ xs: 80, md: 160 }}
        width={{ xs: 80, md: 160 }}
      >
        <picture
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <img
            alt={'avatar'}
            src={avatar || '/images/placeholder_avatar.png'}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
          />
        </picture>
      </Stack>

      <Stack flex={1}>
        <Typography
          sx={{ wordBreak: 'break-word' }}
          variant={'h5'}
          width={'100%'}
        >
          {name}
        </Typography>
        <Typography
          sx={{ wordBreak: 'break-word' }}
          variant={'h6'}
          width={'100%'}
        >
          {title}
        </Typography>
        <Typography
          color={'text.secondary'}
          mt={1.5}
          sx={{ wordBreak: 'break-word' }}
          variant={'body1'}
        >
          {position}
        </Typography>

        <Typography
          alignItems={'center'}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'flex-start'}
          mt={1.5}
          sx={{ wordBreak: 'break-word' }}
          variant={'subtitle1'}
        >
          <PhoneEnabledOutlined
            style={{
              width: 24,
              height: 24,
              marginRight: 12,
              color: 'text.primary',
            }}
          />
          {POSFormatUSPhoneToText(phone)}
        </Typography>
        <Typography
          alignItems={'center'}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'flex-start'}
          mt={1.5}
          sx={{ wordBreak: 'break-word' }}
          variant={'subtitle1'}
        >
          <MailOutlineOutlined
            style={{
              width: 24,
              height: 24,
              marginRight: 12,
              color: 'text.primary',
            }}
          />
          {email}
        </Typography>
      </Stack>
    </Stack>
  );
};
