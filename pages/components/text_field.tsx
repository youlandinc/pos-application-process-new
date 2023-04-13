import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledTextField } from '@/components/atoms';

const TextFieldComponent: FC = () => {
  const router = useRouter();

  const [value1, setValue1] = useState<unknown>('');
  const [value2, setValue2] = useState<unknown>('');
  const [value3, setValue3] = useState<unknown>('');
  const [value4, setValue4] = useState<unknown>('');

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
            <StyledTextField
              label={'static'}
              onChange={(e) => setValue1(e.target.value)}
              placeholder={'static'}
              sx={{ width: 180 }}
              value={value1}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              error array
            </Typography>
            <StyledTextField
              label={'error array'}
              onChange={(e) => setValue2(e.target.value)}
              placeholder={'error array'}
              sx={{ width: 180 }}
              validate={['error 1', 'error 2']}
              value={value2}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              error
            </Typography>
            <StyledTextField
              label={'error'}
              onChange={(e) => setValue3(e.target.value)}
              placeholder={'error'}
              sx={{ width: 180 }}
              validate={['error 1']}
              value={value3}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              disabled
            </Typography>
            <StyledTextField
              disabled
              label={'disabled'}
              onChange={(e) => setValue4(e.target.value)}
              placeholder={'disabled'}
              sx={{ width: 180 }}
              value={value4}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default TextFieldComponent;
