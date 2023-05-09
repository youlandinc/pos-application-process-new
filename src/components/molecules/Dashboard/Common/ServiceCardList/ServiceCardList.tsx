import { FC } from 'react';
import { Box } from '@mui/material';
import { MailOutlineOutlined, PhoneEnabledOutlined } from '@mui/icons-material';

import { TeamMemberData } from '@/views';
import { POSFormatUSPhone } from '@/utils';
import { POSFont } from '@/styles';

interface TeamCardProps {
  data: TeamMemberData;
}

const useStyles = {
  '&.teamCardRoot': {
    mb: 6,
    p: 3,
    borderRadius: 2,
    flex: { lg: 0.5, xs: '100%' },
    border: '1px solid',
    borderColor: 'background.border_default',
  },
  '& .teamCardLeft': {
    ...POSFont({ md: 24, xs: 16 }, 600, 1.5, 'text.primary'),
    flexShrink: 0,
    flex: 1.5,
  },
  '& .teamCardTitle': {},
  '& .teamCardNMLS': {
    mt: 1,
  },
  '& .teamCardTip': {
    my: 3,
    ...POSFont({ md: 16, xs: 12 }, 400, 1.5, 'text.secondary'),
  },
  '& .teamCardRight': {
    flexShrink: 0,
  },
  '& .teamCardContact': {
    mt: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...POSFont({ md: 16, xs: 12 }, 600, 1.5, 'text.primary'),
    '&:first-child': {
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

export const ServiceCardList: FC<TeamCardProps> = (props) => {
  const {
    data: { name, avatar, email, phone, title },
  } = props;

  return (
    <Box className={'teamCardRoot'} sx={useStyles}>
      <Box className={'teamCardLeft'}>
        <Box className={'teamCardTitle'}>{name}</Box>
        <Box className={'teamCardNMLS'}>{title}</Box>
        <Box className={'teamCardTip'}>{avatar}</Box>
      </Box>
      <Box className={'teamCardRight'}>
        <Box className={'teamCardContact'}>
          <PhoneEnabledOutlined className={'logo'} />
          {POSFormatUSPhone(phone)}
        </Box>
        <Box className={'teamCardContact'}>
          <MailOutlineOutlined className={'logo'} />
          {email}
        </Box>
      </Box>
    </Box>
  );
};
