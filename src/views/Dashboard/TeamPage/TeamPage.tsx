import { FC, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import {
  MailOutlineOutlined,
  PhoneEnabledOutlined,
  SupportAgentOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { _fetchMyTeamData } from '@/requests/saas';
import { POSFormatUSPhoneToText } from '@/utils';

import { StyledFormItem, StyledLoading, Transitions } from '@/components/atoms';
import { DashboardServiceCardItem } from '@/components/molecules';

import MY_TEAM from '@/svg/dashboard/my_team.svg';

export interface TeamMemberData {
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
}

export const TeamPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [teamList, setTeamList] = useState<TeamMemberData[]>();
  const [slogan, setSlogan] = useState<string>('');
  const [workTime, setWorkTime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const { loading } = useAsync(async () => {
    await _fetchMyTeamData()
      .then((res) => {
        setTeamList(res?.data?.extInfo?.posSettings?.members || []);
        setSlogan(
          res?.data?.extInfo?.posSettings?.workingDays ||
            "We're available 7 days a week",
        );
        setWorkTime(
          res?.data?.extInfo?.posSettings?.workingHours || '9AM - 6PM PT',
        );
        setEmail(res?.data?.extInfo?.posSettings?.email || '');
        setPhone(res?.data?.extInfo?.posSettings?.phone || '');
      })
      .catch((err) => {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      });
  });

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {loading ? (
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
        <StyledFormItem
          gap={6}
          justifyContent={'flex-start'}
          label={"We're here with you every step of the way"}
          maxWidth={900}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          tip={
            'From choosing a rate to scheduling closing, you have a dedicated team of specialists. Along the way, new faces will show up so be sure to check back often and drop a line if you need anything.'
          }
          tipSx={{ m: 0 }}
        >
          <Stack
            alignItems={'center'}
            bgcolor={'primary.light'}
            borderRadius={2}
            flexDirection={{ xl: 'row', xs: 'column' }}
            gap={3}
            justifyContent={'space-between'}
            p={3}
            width={'100%'}
          >
            <Stack color={'text.primary'} flex={1.5} flexShrink={0} gap={1.5}>
              <Typography variant={'h4'}>Hours of operation</Typography>

              <Typography
                color={'text.secondary'}
                mb={1.5}
                variant={'body1'}
                width={'100%'}
              >
                If your current expert isn&apos;t available, you can leave a
                message for them or speak with someone else.
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

              <Typography
                alignItems={'center'}
                color={'text.primary'}
                display={'flex'}
                gap={1.5}
                justifyContent={'flex-start'}
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
            </Stack>

            <Icon
              component={MY_TEAM}
              sx={{
                width: { xl: '60%', xs: '85%' },
                height: 'auto',
              }}
            />
          </Stack>

          <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3} width={'100%'}>
            {teamList?.map((item, index) => (
              <DashboardServiceCardItem data={item} key={index} />
            ))}
          </Stack>
        </StyledFormItem>
      )}
    </Transitions>
  );
};
