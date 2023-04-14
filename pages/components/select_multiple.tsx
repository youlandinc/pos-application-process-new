import { POSTypeOf } from '@/utils';
import { FC, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { StyledButton, StyledSelectMultiple } from '@/components/atoms';
import {
  OPTIONS_BRIDGE_PROPERTY_NUMBER,
  OPTIONS_COMMON_STATE,
} from '@/constants';

const SelectComponent: FC = () => {
  const router = useRouter();

  const [value1, setValue1] = useState<string[]>([]);

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
        <Typography variant={'h4'}>Status</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              static
            </Typography>
            <StyledSelectMultiple
              label={'static'}
              onValueChange={(v) => setValue1([...value1, ...v])}
              options={OPTIONS_BRIDGE_PROPERTY_NUMBER}
              sx={{ width: '100%' }}
              value={value1}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectComponent;
