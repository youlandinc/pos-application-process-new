import { StyledBrand, StyledButton } from '@/components/atoms';
import { POSHeader } from '@/components/molecules';
import { LayoutSceneTypeEnum } from '@/types';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Stack height={'calc(100vh - 36px)'} minHeight={667} width={'100vw'}>
        <POSHeader scene={LayoutSceneTypeEnum.not_found} />
        <Stack
          alignItems={'center'}
          gap={3}
          height={'calc(100% - 92px)'}
          justifyContent={'center'}
          maxWidth={600}
          mx={'auto'}
          width={'100%'}
        >
          <Image
            alt={'404'}
            height={180}
            loading={'lazy'}
            src={'/404.svg'}
            unoptimized
            width={364}
          />

          <Stack alignItems={'center'} mt={3}>
            <Typography fontSize={20} fontWeight={600}>
              Oops! Loan not found
            </Typography>
            <Typography mt={1.5} textAlign={'center'}>
              Sorry, we can’t find the page you’re looking for.
            </Typography>
            <Typography textAlign={'center'}>
              For assistance, please contact our support team at (833) 968-5263.
            </Typography>
          </Stack>

          <StyledButton
            onClick={() => router.push('/pipeline')}
            size={'small'}
            sx={{
              bgcolor: '#5B76BC !important',
              mt: 3,
            }}
          >
            Go to pipeline
          </StyledButton>
        </Stack>
      </Stack>
      <StyledBrand />
    </>
  );
}
