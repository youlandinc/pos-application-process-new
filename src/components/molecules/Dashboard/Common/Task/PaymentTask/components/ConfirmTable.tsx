import { ChangeEvent, FC } from 'react';
import { Box, Typography } from '@mui/material';
// import { CallOutlined, MailOutlineOutlined } from '@mui/icons-material';
import { StyledCheckbox, StyledFormItem } from '@/components/atoms';

import { POSFlex, POSFont } from '@/styles';

// import { utils } from '@/common/utils';

const useStyle = {
  '&.container': {},

  '& .confirmBox': {
    mt: 6,
    ...POSFlex('center', 'center', 'row'),
    width: '100%',
    maxWidth: 600,
  },
  '& .tipContainer': {
    marginBlockStart: 24,
  },
  '& .tipHeader': {
    ...POSFont(24, 400, 1.5, 'rgba(0,0,0,.87)'),
  },
  '& .tipMain': {
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.6)'),
  },
  '& .tipFooter': {
    ...POSFlex('center', 'flex-start', 'row'),
    marginBlockStart: 12,
  },
  '& .logoWrap': {
    ...POSFlex('center', 'flex-start', 'row'),
    color: 'rgba(0,0,0,.6)',
    '&:last-of-type': {
      marginLeft: 24,
    },
  },
  '& .logo': {
    width: 24,
    height: 24,
    marginRight: 12,
    color: 'rgba(0,0,0,.6)',
  },
};

interface ConfirmTableProps {
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
}

export const ConfirmTable: FC<ConfirmTableProps> = (props) => {
  const { onCheckValueChange, check } = props;

  // const tenantConfig = utils.getTenantConfig();

  return (
    <StyledFormItem
      alignItems={'center'}
      label={'Confirm your interest in this loan'}
      sx={useStyle}
      tip={
        <>
          <Typography color={'info.main'} variant={'body1'}>
            We&apos;re just about ready to move to the next step in the
            application process but first we need to take care of one legal
            detail.
          </Typography>
          <Typography color={'info.main'} mt={1.5} variant={'body1'}>
            According to federal regulations, all lenders are required to go
            through a step called Intent to Proceed. It can sound like a big
            commitment but don&apos;t worry - this isn&apos;t legally-binding
            and if something comes up, you can still back out down the road.
            This just lets us know that you understand your loan terms.
          </Typography>
        </>
      }
    >
      {/* <Box className={'tipContainer'}>
        <Box className={'tipHeader'}>
          Tips from{' '}
          {
            // todo sass
            // tenantConfig.organizationName ||
            'YouLand'
          }
          :
        </Box>
        <Box className={'tipMain'}>
          If you have any questions, feel free to contact us and we&apos;ll help
          you out.
        </Box>
        <Box className={'tipFooter'}>
          <Box className={'logoWrap'}>
            <CallOutlined className={'logo'} />
            {
              // tenantConfig.extInfo?.posSettings?.phone ||
              '1-833-968-5263'
            }
          </Box>
          <Box className={'logoWrap'}>
            <MailOutlineOutlined className={'logo'} />
            {
              // tenantConfig.extInfo?.posSettings?.email ||
              'borrow@youland.com'
            }
          </Box>
        </Box>
      </Box> */}
      <Box className={'confirmBox'}>
        <StyledCheckbox
          checked={check}
          label="I intend to proceed with this loan."
          onChange={onCheckValueChange}
        />
      </Box>
    </StyledFormItem>
  );
};
