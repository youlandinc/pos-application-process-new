import { FC } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { StyledButton } from '@/components';

export const PipelineAgreement: FC = () => {
  const router = useRouter();

  return (
    <>
      agreement
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={3}
        justifyContent={'center'}
      >
        <StyledButton
          color={'info'}
          onClick={() => router.back()}
          sx={{ width: 276 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton onClick={() => router.back()} sx={{ width: 276 }}>
          Save
        </StyledButton>
      </Stack>
    </>
  );
};
