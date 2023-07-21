import { FC } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { POSFormatPercent } from '@/utils';

interface StyledProgressLineProps {
  total: number;
  current: number;
}

export const StyledProgressLine: FC<StyledProgressLineProps> = ({
  total,
  current,
}) => {
  const percent = current / total;
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      maxWidth={600}
      width={'100%'}
    >
      <Box bgcolor={'#C2EBD6'} borderRadius={1} flex={1} height={4}>
        <Box
          bgcolor={'success.main'}
          borderRadius={1}
          height={4}
          sx={{ transition: 'width 1s ease-in-out' }}
          width={POSFormatPercent(percent, 0)}
        />
      </Box>
      <Typography flexShrink={0} ml={1}>
        {POSFormatPercent(percent, 0)}
      </Typography>
    </Stack>
  );
};
