import { FC, useState } from 'react';
import { Box, CircularProgress, Icon, SxProps } from '@mui/material';
import { useAsync } from 'react-use';
import { _fetchMyTeamData } from '@/requests/saas';

import { POSFont, POSSize } from '@/styles';

import { PageHeader, ServiceCardList } from '@/components';
import {
  MailOutlineOutlined,
  PhoneEnabledOutlined,
  SupportAgentOutlined,
  WatchLaterOutlined,
} from '@mui/icons-material';
import { POSFormatUSPhone } from '@/utils';
import MY_TEAM from '@/svg/dashboard/my_team.svg';

const useStyles: SxProps = {
  '&.container': {
    width: '100%',
    padding: '48px 7.5vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  '& .pageMain': {
    marginTop: 6,
    width: '100%',
  },
  '& .cardListWrap': {
    maxWidth: 1312,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
  },
  '& .pageFooter': {
    marginTop: 3,
    fontSize: 16,
    lineHeight: 1.5,
    color: 'rgba(0,0,0,.6)',
    width: '100%',
    maxWidth: 1312,
  },
  '& .my_team_svg': {
    width: { md: '45%', xs: '85%' },
    height: '100%',
    mt: {
      md: 0,
      xs: 3,
    },
  },
  '& .otherWrap': {
    background: '#F5F8FA',
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    p: 3,
  },
  '& .otherInfoBox': {
    flex: 1.5,
    flexShrink: 0,
    lineHeight: 1.5,
    color: 'rgba(0,0,0,.6)',
  },
  '& .otherInfoTitle': {
    ...POSFont({ md: 24, xs: 16 }, 600, 1.5, 'text.primary'),
  },
  '& .otherInfoTip': {
    ...POSFont({ md: 16, xs: 12 }, 400, 1.5, 'text.secondary'),
    mt: 1.5,
    mb: 3,
    width: '80%',
  },
  '& .otherInfoTime': {
    fontWeight: 700,
  },
  '& .otherInfoContact': {
    mt: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...POSFont({ md: 16, xs: 12 }, 600, 1.5, 'text.primary'),
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  '& .logo': {
    width: 24,
    height: 24,
    mr: 1.5,
    color: 'text.primary',
  },
};

export interface TeamMemberData {
  name: string;
  title: string;
  avatar: string;
  phone: string;
  email: string;
}

export const TeamPage: FC = () => {
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
        // console.log(err);
      });
  });

  return (
    <Box className={'container'} sx={useStyles}>
      {loading ? (
        <CircularProgress
          style={{ color: '#fff', ...POSSize(24), marginRight: 3 }}
        />
      ) : (
        <>
          <PageHeader
            subTitle={` From choosing a rate to scheduling closing, you have a dedicated
              team of specialists. Along the way, new faces will show up so be sure to check back
              often and drop a line if you need anything.`}
            title={"We're here with you every step of the way"}
          />
          <Box className={'pageFooter'}>
            <Box className={'otherWrap'}>
              <Box className={'otherInfoBox'}>
                <Box className={'otherInfoTitle'}>Hours of Operation</Box>
                <Box className={'otherInfoTip'}>
                  If your current expert isn&apos;t available, you can leave a
                  message for them or speak with someone else.
                </Box>
                <Box className={'otherInfoContact'}>
                  <PhoneEnabledOutlined className={'logo'} />
                  {POSFormatUSPhone(phone)}
                </Box>
                <Box className={'otherInfoContact'}>
                  <MailOutlineOutlined className={'logo'} />
                  {email}
                </Box>
                <Box className={'otherInfoContact'} mt={'8px'}>
                  <SupportAgentOutlined className={'logo'} />
                  {slogan}
                </Box>
                <Box className={'otherInfoContact'}>
                  {' '}
                  <WatchLaterOutlined className={'logo'} /> {workTime}
                </Box>
              </Box>
              {/* <Image
                alt={''}
                height={140}
                src={'/my_team_footer.png'}
                width={216}
              /> */}
              <Icon className={'my_team_svg'} component={MY_TEAM} />
            </Box>
          </Box>
          <Box className={'pageMain'}>
            <Box className={'cardListWrap'}>
              {teamList?.map((item, index) => (
                <ServiceCardList data={item} key={index} />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};
