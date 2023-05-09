import { parseISO } from 'date-fns';
import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledDatePicker } from '@/components/atoms';

import { observer } from 'mobx-react-lite';

const GoogleMapComponent: FC = observer(() => {
  const router = useRouter();

  const [date, setDate] = useState<unknown>(parseISO('2021-11-10'));

  return (
    <Box
      sx={{
        p: 4,
        width: { lg: '50%', xs: '100%' },
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
            <StyledDatePicker
              onChange={(e) => {
                setDate(e);
              }}
              value={date}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
export default GoogleMapComponent;
