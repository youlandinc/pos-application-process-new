import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { POSFormatUSPhoneToText } from '@/utils';
import { TeamMemberData } from '@/types';

import { useBreakpoints } from '@/hooks';

interface TeamMemberCardItemProps {
  data: TeamMemberData;
}

import TEAM_PHONE from '@/svg/dashboard/team_phone.svg';
import TEAM_EMAIL from '@/svg/dashboard/team_email.svg';

export const TeamMemberCardItem: FC<TeamMemberCardItemProps> = ({
  data: { name, avatar, email, phone, title, position },
}) => {
  const breakpoint = useBreakpoints();

  return (
    <Stack
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      gap={{ xs: 1, md: 1.5 }}
      p={{ xs: 2, lg: 3 }}
      width={'100%'}
    >
      <Stack
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={1.25}
        width={'100%'}
      >
        <Stack
          height={{ xs: 'auto', md: 64 }}
          justifyContent={{ xs: 'unset', md: 'center' }}
          order={{ xs: 2, md: 1 }}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 16, md: 18 }}
            variant={'h7'}
          >
            {name}
          </Typography>
          {title && (
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 12, md: 14, xl: 16 }}
            >
              {title}
            </Typography>
          )}
        </Stack>

        <picture
          style={{
            width: ['xs', 'sm'].includes(breakpoint) ? 48 : 64,
            height: ['xs', 'sm'].includes(breakpoint) ? 48 : 64,
            marginLeft: ['xs', 'sm'].includes(breakpoint) ? 0 : 'auto',
            order: ['xs', 'sm'].includes(breakpoint) ? 1 : 2,
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

      {position && (
        <Typography fontSize={{ xs: 12, md: 14, xl: 16 }}>
          {position}
        </Typography>
      )}

      <Stack
        flexDirection={{ xs: 'column', md: 'row' }}
        fontSize={{ xs: 12, md: 14 }}
        gap={{ xs: 0.5, xl: 3 }}
        mt={position ? 0 : 1}
        width={'100%'}
      >
        <Stack alignItems={'center'} flexDirection={'row'}>
          <Icon
            component={TEAM_PHONE}
            sx={{ width: 20, height: 20, mr: 1.25 }}
          />
          {POSFormatUSPhoneToText(phone)}
        </Stack>

        <Stack alignItems={'center'} flexDirection={'row'}>
          <Icon
            component={TEAM_EMAIL}
            sx={{ width: 20, height: 20, mr: 1.25 }}
          />
          {email}
        </Stack>
      </Stack>
    </Stack>
  );
};
