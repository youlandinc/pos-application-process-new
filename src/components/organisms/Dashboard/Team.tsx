import { useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import {
  MailOutlineOutlined,
  PhoneEnabledOutlined,
  SupportAgentOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFormatUSPhoneToText, POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import { TeamMemberCardItem } from '@/components/molecules';

import { HttpError, TeamMemberData } from '@/types';
import { _fetchTeamMembers } from '@/requests/dashboard';

import MY_TEAM from '@/svg/dashboard/my_team.svg';

export const Team = () => {
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [teamList, setTeamList] = useState<TeamMemberData[]>();
  const [slogan, setSlogan] = useState<string>('');
  const [workTime, setWorkTime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const {
        data: { loanOfficers, email, workingDays, workingHours, phone },
      } = await _fetchTeamMembers(loanId);

      setTeamList(loanOfficers);
      setSlogan(workingDays || "We're available 7 days a week");
      setWorkTime(workingHours || '9AM - 6PM PT');
      setEmail(email || '');
      setPhone(phone || '');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          My team
        </Typography>

        <Stack
          alignItems={'center'}
          bgcolor={'primary.lightest'}
          borderRadius={2}
          flexDirection={{ xl: 'row', xs: 'column' }}
          gap={3}
          p={{ lg: '24px 24px 24px 48px', xs: 3 }}
          width={'100%'}
        >
          <Stack
            color={'text.primary'}
            flex={1.5}
            flexShrink={0}
            gap={1.5}
            justifyContent={'space-between'}
          >
            <Typography variant={'h4'}>Hours of operation</Typography>

            <Typography
              alignItems={'center'}
              color={'text.primary'}
              display={'flex'}
              gap={1.5}
              justifyContent={'flex-start'}
              mt={1.5}
              variant={'subtitle1'}
            >
              <SupportAgentOutlined sx={{ width: 24, height: 24 }} />
              {slogan}
            </Typography>

            <Typography
              alignItems={'center'}
              color={'text.primary'}
              display={'flex'}
              gap={1.5}
              justifyContent={'flex-start'}
              variant={'subtitle1'}
            >
              <WatchLaterOutlined sx={{ width: 24, height: 24 }} />
              {workTime}
            </Typography>

            <Typography
              alignItems={'center'}
              color={'text.primary'}
              display={'flex'}
              gap={1.5}
              justifyContent={'flex-start'}
              variant={'subtitle1'}
            >
              <PhoneEnabledOutlined sx={{ width: 24, height: 24 }} />
              {POSFormatUSPhoneToText(phone)}
            </Typography>

            <Typography
              alignItems={'center'}
              color={'text.primary'}
              display={'flex'}
              gap={1.5}
              justifyContent={'flex-start'}
              variant={'subtitle1'}
            >
              <MailOutlineOutlined sx={{ width: 24, height: 24 }} />
              {email}
            </Typography>
          </Stack>

          <Icon
            component={MY_TEAM}
            sx={{
              width: { xl: 'calc(50% - 12px)', xs: '85%' },
              height: 'auto',
              '& .my_team_svg__pos_svg_theme_color': {
                fill: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
              },
            }}
          />
        </Stack>

        <Stack
          flexDirection={'row'}
          flexWrap={'wrap'}
          gap={3}
          mt={3}
          width={'100%'}
        >
          {teamList?.map((item, index) => (
            <TeamMemberCardItem data={item} key={index} />
          ))}
        </Stack>
      </Stack>
    </Fade>
  );
};
