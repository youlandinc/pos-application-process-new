import { CSSProperties, FC } from 'react';
import { Box } from '@mui/material';
import { User } from '@/types/user';
import { EmailOutlined, PhoneOutlined } from '@mui/icons-material';

interface BusinessCardProps {
  data: User.TeamMemberInfo;
  style?: CSSProperties;
}

export const BusinessCard: FC<BusinessCardProps> = (props) => {
  const {
    data: {
      firstName,
      profile,
      NMSLNumber,
      title,
      email,
      lastName,
      phoneNumber,
    },
    style = {},
  } = props;

  return (
    <Box style={style}>
      <Box fontSize={16} fontWeight={'bold'} sx={useStyles}>
        {firstName} {lastName}
      </Box>
      <Box fontSize={16} fontWeight={'bold'} minHeight={'20px'} mt={'8px'}>
        {title} {title && NMSLNumber && '|'} {NMSLNumber}
      </Box>
      <Box color={'rgba(0, 0, 0, .5)'} mt={'6px'}>
        {profile}
      </Box>
      <Box className={'POS_flex POS_al_c POS_jc_c'} mt={'18px'}>
        <Box className={'POS_flex POS_al_c POS_jc_c'} mr={'100px'}>
          <PhoneOutlined
            style={{ marginRight: 1, fontSize: 20, color: '#3F81E9' }}
            viewBox={'0 0 21 16'}
          />
          {phoneNumber}
        </Box>
        <Box className={'POS_flex POS_al_c POS_jc_c'}>
          <EmailOutlined
            style={{ marginRight: 1, fontSize: 20, color: '#3F81E9' }}
            viewBox={'0 0 21 16'}
          />
          {email}
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = {
  width: 1008,
  textAlign: 'left',
  boxShadow: '1px 1px 15px rgba(0, 0, 0, 0.15)',
  borderRadius: 3,
  padding: '48px 84px',
};
