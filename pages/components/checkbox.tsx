import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Typography } from '@mui/material';

import { StyledButton, StyledCheckbox } from '@/components/atoms';

const CheckboxComponent: FC = () => {
  const router = useRouter();

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(true);
  const [check6, setCheck6] = useState(true);

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
            <StyledCheckbox
              checked={check1}
              label={'This is NO.1 checkbox demo'}
              onChange={(e) => setCheck1(e.target.checked)}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              checked
            </Typography>
            <StyledCheckbox
              checked={check2}
              label={'This is NO.2 checkbox demo'}
              onChange={(e) => setCheck2(e.target.checked)}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              intermediate
            </Typography>
            <StyledCheckbox
              checked={check3}
              indeterminate={check3}
              label={'This is NO.3 checkbox demo'}
              onChange={(e) => setCheck3(e.target.checked)}
            />
          </Box>
        </Box>
      </Box>
      <Box className={'component_wrap'} mt={5}>
        <Typography variant={'h4'}>Disabled Status</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              static
            </Typography>
            <StyledCheckbox
              checked={check4}
              disabled={true}
              label={'This is NO.4 checkbox demo'}
              onChange={(e) => setCheck4(e.target.checked)}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              checked
            </Typography>
            <StyledCheckbox
              checked={check5}
              disabled={true}
              label={'This is NO.5 checkbox demo'}
              onChange={(e) => setCheck5(e.target.checked)}
            />
          </Box>
          <Box>
            <Typography mb={2} variant={'body1'}>
              intermediate
            </Typography>
            <StyledCheckbox
              checked={check6}
              disabled={true}
              indeterminate={check6}
              label={'This is NO.6 checkbox demo'}
              onChange={(e) => setCheck6(e.target.checked)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckboxComponent;
