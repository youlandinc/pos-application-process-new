import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { POSFormatUSPhoneToText } from '@/utils';
import { TeamMemberData } from '@/types';

interface TeamMemberCardItemProps {
  data: TeamMemberData;
}

import TEAM_PHONE from '@/svg/dashboard/team_phone.svg';
import TEAM_EMAIL from '@/svg/dashboard/team_email.svg';

export const TeamMemberCardItem: FC<TeamMemberCardItemProps> = ({
  data: { name, avatar, email, phone, title, position },
}) => {
  return (
    <Stack
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      gap={1.5}
      p={3}
      width={'100%'}
    >
      <Stack
        alignItems={{
          xs: 'center',
          md: 'unset',
        }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={{ xs: 1.5, md: 2.5 }}
        width={'100%'}
      >
        <picture
          style={{
            width: '64px',
            height: '64px',
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

        <Stack
          alignItems={{
            xs: 'center',
            md: 'unset',
          }}
          gap={1.25}
          height={{ xs: 'auto', md: 64 }}
          justifyContent={'center'}
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
      </Stack>

      {position && (
        <Typography
          fontSize={{ xs: 12, md: 14, xl: 16 }}
          mt={1}
          textAlign={{
            xs: 'center',
            md: 'unset',
          }}
        >
          {position}
        </Typography>
      )}

      <Stack
        flexDirection={'row'}
        flexWrap={'wrap'}
        fontSize={{ xs: 12, md: 14 }}
        gap={3}
        justifyContent={{
          xs: 'center',
          md: 'unset',
        }}
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
