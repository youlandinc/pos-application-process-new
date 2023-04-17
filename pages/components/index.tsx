import { StyledButton } from '@/components/atoms';
import { POSFlex } from '@/styles';
import { Box, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const Components = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        m: 4,
        p: 4,
        width: '50%',
        '& .component_wrap': {
          m: 4,
          p: 4,
          borderRadius: 4,
          boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
          '& .divider': {
            my: 2,
          },
          '& .component_list': {
            ...POSFlex('center', 'flex-start', 'row'),
            gap: 2,
            listStyle: 'none',
            p: 0,
            m: 0,
            '& .component_item': {
              listStyle: 'none',
              p: 0,
              m: 0,
            },
          },
        },
      }}
    >
      <Box className={'component_wrap'}>
        <Typography className={'component_title'} variant={'h4'}>
          Base Component
        </Typography>
        <Divider className={'divider'} />
        <Box className={'component_list'} component={'ul'}>
          <Box className={'component_item'}>
            <StyledButton onClick={() => router.push('/components/checkbox')}>
              Checkbox
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton onClick={() => router.push('/components/text_field')}>
              TextField
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton onClick={() => router.push('/components/button')}>
              Button
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton onClick={() => router.push('/components/select')}>
              Select
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton
              onClick={() => router.push('/components/select_multiple')}
            >
              Multiple Select
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton onClick={() => router.push('/components/tooltip')}>
              Tooltip
            </StyledButton>
          </Box>
        </Box>
      </Box>
      <Box className={'component_wrap'}>
        <Typography className={'component_title'} variant={'h4'}>
          Composite Component
        </Typography>
        <Divider className={'divider'} />
        <Box className={'component_list'} component={'ul'}>
          <Box className={'component_item'}>
            <StyledButton
              color="primary"
              onClick={() => router.push('/components/dialog')}
              variant="contained"
            >
              Open Dialog
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton
              color="primary"
              onClick={() => router.push('/components/button_group')}
              variant="contained"
            >
              Button Group
            </StyledButton>
          </Box>
          <Box className={'component_item'}>
            <StyledButton
              color="primary"
              onClick={() => router.push('/components/google_map')}
              variant="contained"
            >
              Google Auto Complete
            </StyledButton>
          </Box>
        </Box>
      </Box>
      <Box className={'component_wrap'}>
        <Typography className={'component_title'} variant={'h4'}>
          Business Component
        </Typography>
        <Divider className={'divider'} />
        <Box className={'component_list'} component={'ul'}>
          <Box className={'component_item'}>
            <StyledButton
              onClick={() => router.push('/components/business_text_field')}
            >
              TextField (Number, Phone, Social Number,etc...)
            </StyledButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Components;
