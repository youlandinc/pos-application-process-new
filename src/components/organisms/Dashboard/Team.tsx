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
        width={'100%'}
      >
        <Typography fontSize={{ xs: 20, md: 24 }}>
          My team
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={3}
          >
            Our dedicated team of loan management specialists is here to provide
            you with personalized solutions and expert advice.
          </Typography>
        </Typography>

        <Stack
          alignItems={{ xs: 'unset', md: 'center' }}
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={{ xs: 1, md: 1.5 }}
          p={{ xs: 2, lg: 3 }}
          width={'100%'}
        >
          <Stack
            fontSize={{
              xs: 12,
              md: 14,
              xl: 16,
            }}
            gap={0.5}
            order={{ xs: 2, md: 1 }}
          >
            <Typography
              fontSize={{
                xs: 16,
                md: 18,
              }}
              variant={'h7'}
            >
              Hours of operation
            </Typography>
            <Typography color={'text.primary'} fontSize={'inherit'}>
              {slogan}
            </Typography>
            <Typography color={'text.primary'} fontSize={'inherit'}>
              {workTime}
            </Typography>
          </Stack>
          <Icon
            component={TEAM_OPERATION}
            sx={{
              width: { xs: 48, md: 64 },
              height: { xs: 48, md: 64 },
              ml: { xs: 0, md: 'auto' },
              order: { xs: 1, md: 2 },
            }}
          />
        </Stack>

        <Stack
          alignItems={{ xs: 'unset', md: 'center' }}
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={{ xs: 1, md: 1.5 }}
          p={{ xs: 2, lg: 3 }}
          width={'100%'}
        >
          <Stack
            fontSize={{
              xs: 12,
              md: 14,
              xl: 16,
            }}
            gap={0.5}
            order={{ xs: 2, md: 1 }}
          >
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
            <Typography color={'text.primary'} fontSize={'inherit'}>
              {email}
            </Typography>
            <Typography color={'text.primary'} fontSize={'inherit'}>
              {POSFormatUSPhoneToText(phone)}
            </Typography>
          </Stack>
          <Icon
            component={TEAM_CONTACT}
            sx={{
              width: { xs: 48, md: 64 },
              height: { xs: 48, md: 64 },
              ml: { xs: 0, md: 'auto' },
              order: { xs: 1, md: 2 },
            }}
          />
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
