import { FC, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  StyledButton,
  StyledSelect,
  StyledSelectOption,
} from '@/components/atoms';
import {
  OPTIONS_BRIDGE_PROPERTY_NUMBER,
  OPTIONS_COMMON_STATE,
} from '@/constants';

const SelectComponent: FC = () => {
  const router = useRouter();

  const [value1, setValue1] = useState<unknown>('');
  const [value2, setValue2] = useState<unknown>('VT');
  const [value3, setValue3] = useState<unknown>('five_more');
  const [value4, setValue4] = useState<unknown>('SC');

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
        <Typography variant={'h4'}>Status</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              static
            </Typography>
            <StyledSelect
              label={'static'}
              onChange={(e) => setValue1(e.target.value)}
              options={OPTIONS_BRIDGE_PROPERTY_NUMBER}
              sx={{ width: 200 }}
              value={value1}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              selected
            </Typography>
            <StyledSelect
              label={'selected'}
              onChange={(e) => setValue2(e.target.value)}
              options={OPTIONS_COMMON_STATE}
              sx={{ width: 400 }}
              value={value2}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              error
            </Typography>
            <StyledSelect
              label={'error'}
              onChange={(e) => setValue3(e.target.value)}
              options={OPTIONS_BRIDGE_PROPERTY_NUMBER}
              sx={{ width: 200 }}
              validate={['error1', 'error2']}
              value={value3}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              disabled
            </Typography>
            <StyledSelect
              disabled
              label={'disabled'}
              onChange={(e) => setValue4(e.target.value)}
              options={OPTIONS_COMMON_STATE}
              value={value4}
            />
            <StyledSelectOption
              onChange={(v) => setValue3(v)}
              options={OPTIONS_BRIDGE_PROPERTY_NUMBER}
              value={value3}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectComponent;
