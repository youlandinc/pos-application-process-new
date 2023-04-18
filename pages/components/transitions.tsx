import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import {
  StyledButton,
  StyledButtonGroup,
  StyledGoogleAutoComplete,
  Transitions,
} from '@/components/atoms';

import { Address } from '@/models/common/Address';

const TransitionsComponent: FC = () => {
  const router = useRouter();

  const [value, setValue] = useState(false);
  const [address] = useState(
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
        <Typography variant={'h4'}>Transitions</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              Status
            </Typography>
            <StyledButtonGroup
              onChange={(
                event: React.MouseEvent<HTMLElement>,
                newAlignment: boolean,
              ) => {
                setValue(newAlignment);
              }}
              options={[
                { value: true, label: 'Show' },
                { value: false, label: 'Hide' },
              ]}
              value={value}
            />
            <Typography mb={2} mt={3} variant={'body1'}>
              full address
            </Typography>
            <Transitions>
              {value && <StyledGoogleAutoComplete address={address} />}
            </Transitions>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default TransitionsComponent;
