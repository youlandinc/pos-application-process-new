import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { MailOutlineOutlined, PhoneEnabledOutlined } from '@mui/icons-material';

import { POSFormatUSPhoneToText } from '@/utils';
import { TeamMemberData } from '@/views';

interface DashboardServiceCardItemProps {
  data: TeamMemberData;
}

export const DashboardServiceCardItem: FC<DashboardServiceCardItemProps> = ({
  data: { name, avatar, email, phone, title },
}) => {
  return (
    <Box
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      p={3}
      width={{ lg: 'calc(50% - 12px)', xs: '100%' }}
    >
      <Stack flex={1.5} gap={1.5}>
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
          mb={3}
          mt={1.5}
          sx={{ wordBreak: 'break-word' }}
          variant={'body1'}
        >
          {avatar}
        </Typography>
      </Stack>

      <Stack gap={1.5}>
        <Typography
          alignItems={'center'}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'flex-start'}
          sx={{ wordBreak: 'break-word' }}
          variant={'subtitle1'}
          width={'100%'}
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
          sx={{ wordBreak: 'break-word' }}
          variant={'subtitle1'}
          width={'100%'}
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
    </Box>
  );
};
