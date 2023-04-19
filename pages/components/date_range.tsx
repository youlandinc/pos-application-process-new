import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledDateRange } from '@/components/atoms';
import { format } from 'date-fns';

const DatePickerComponent: FC = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

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
        <Typography variant={'h4'}>DatePicker</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              Status
            </Typography>
            {dateRange[0] && format(dateRange[0], "yyyy-MM-dd'T'HH:mm:ss'Z'")}-
            {dateRange[1] && format(dateRange[1], "yyyy-MM-dd'T'HH:mm:ss'Z'")}
            <Box sx={{ width: 300 }}>
              <StyledDateRange
                dateRange={dateRange}
                label="日期"
                onChange={(date: [Date | null, Date | null]) =>
                  setDateRange(date)
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default DatePickerComponent;
