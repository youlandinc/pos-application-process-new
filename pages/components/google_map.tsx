import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledGoogleAutoComplete } from '@/components/atoms';

import { observer } from 'mobx-react-lite';

import { Address } from '@/models/common/Address';

const GoogleMapComponent: FC = observer(() => {
  const router = useRouter();

  const [address1] = useState(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [address2] = useState(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [address3] = useState(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  return (
    <Box
      sx={{
        m: 4,
        p: 4,
        width: '50%',
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        '& .component_wrap': {
          '& .divider': {
            my: 2,
          },
          '& .component_item': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
            p: 4,
            borderRadius: 4,
          },
        },
      }}
    >
      <StyledButton
        onClick={() => router.back()}
        sx={{
          my: 3,
        }}
        variant={'outlined'}
      >
        back to components
      </StyledButton>

      <Box className={'component_wrap'}>
        <Typography variant={'h4'}>Static Status</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              static
            </Typography>
            <StyledGoogleAutoComplete address={address1} />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              full address
            </Typography>
            <StyledGoogleAutoComplete address={address2} fullAddress={false} />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              disabled
            </Typography>
            <StyledGoogleAutoComplete address={address3} disabled fullAddress />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
export default GoogleMapComponent;
