import { useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { useBreakpoints } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFormatUSPhoneToText, POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import { TeamMemberCardItem } from '@/components/molecules';

import { HttpError, TeamMemberData } from '@/types';
import { _fetchTeamMembers } from '@/requests/dashboard';

import TEAM_OPERATION from '@/svg/dashboard/team_operation.svg';
import TEAM_CONTACT from '@/svg/dashboard/team_contact.svg';

export const Team = () => {
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

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
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1.5}
            textAlign={'center'}
          >
            Our dedicated team of loan management specialists is here to provide
            you with personalized solutions and expert advice.
          </Typography>
        </Typography>

        <Stack
          alignItems={'center'}
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={3}
          width={'100%'}
        >
          <Stack
            alignItems={'center'}
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            flex={1}
            gap={1.5}
            p={3}
            width={'100%'}
          >
            <Icon component={TEAM_OPERATION} sx={{ width: 64, height: 64 }} />
            <Typography
              color={'text.primary'}
              fontSize={{
                xs: 16,
                md: 18,
              }}
              variant={'h7'}
            >
              Hours of operation
            </Typography>

            <Stack
              alignItems={'center'}
              fontSize={{
                xs: 12,
                md: 14,
                xl: 16,
              }}
              gap={0.5}
            >
              <Typography color={'text.primary'} fontSize={'inherit'}>
                {slogan}
              </Typography>
              <Typography color={'text.primary'} fontSize={'inherit'}>
                {workTime}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            alignItems={'center'}
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            flex={1}
            gap={1.5}
            p={3}
            width={'100%'}
          >
            <Icon component={TEAM_CONTACT} sx={{ width: 64, height: 64 }} />

            <Typography
              color={'text.primary'}
              fontSize={{
                xs: 16,
                md: 18,
              }}
              variant={'h7'}
            >
              Contact us
            </Typography>

            <Stack
              alignItems={'center'}
              fontSize={{
                xs: 12,
                md: 14,
                xl: 16,
              }}
              gap={0.5}
            >
              <Typography color={'text.primary'} fontSize={'inherit'}>
                {email}
              </Typography>
              <Typography color={'text.primary'} fontSize={'inherit'}>
                {POSFormatUSPhoneToText(phone)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3} width={'100%'}>
          {teamList?.map((item, index) => (
            <TeamMemberCardItem data={item} key={index} />
          ))}
        </Stack>
      </Stack>
    </Fade>
  );
};
