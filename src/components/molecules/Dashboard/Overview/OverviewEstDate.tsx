import { FC } from 'react';
import { Stack, Typography } from '@mui/material';

export const OverviewEstDate: FC<{ estDate: string }> = ({ estDate }) => {
  return (
    <Stack gap={1.5} width={'100%'}>
      <Typography fontSize={{ xs: 16, md: 20 }}>Date</Typography>

      <Stack flexDirection={'row'} gap={1.5} mt={2}>
        <Stack bgcolor={'#D6E2FF'} borderRadius={3} height={56} width={56}>
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #BACFFF'}
            flex={1}
            fontSize={12}
            justifyContent={'center'}
          >
            Nov
          </Stack>
          <Stack
            alignItems={'center'}
            flex={1.5}
            fontSize={14}
            fontWeight={600}
            justifyContent={'center'}
          >
            09
          </Stack>
        </Stack>

        <Stack justifyContent={'center'}>
          <Typography variant={'body2'}>Est. funding date</Typography>
          <Typography variant={'body2'}>November 08 2024</Typography>
        </Stack>
      </Stack>
      <Typography color={'text.secondary'} variant={'body2'}>
        Completing any outstanding tasks promptly will increase the likelihood
        of funding on this date.
      </Typography>
    </Stack>
  );
};
