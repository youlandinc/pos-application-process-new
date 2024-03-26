import { FC, useState } from 'react';
import { Icon, Rating, Stack, Typography } from '@mui/material';

import { _portalRating } from '@/requests';

import { StyledButton } from '@/components/atoms';

import DOCUMENT_PORTAL_PROGRESS from './document_portal_progress.svg';

interface LoanProgressProps {
  cb?: () => void;
  loanId: string;
}

export const SaasLoanProgress: FC<LoanProgressProps> = ({ cb, loanId }) => {
  const [value, setValue] = useState<number | null>(0);

  return (
    <Stack alignItems={'center'} gap={3}>
      <Typography
        fontSize={'clamp(28px,3.2vw,36px)'}
        textAlign={'center'}
        variant={'h3'}
      >
        Feature under construction
      </Typography>
      <Icon
        component={DOCUMENT_PORTAL_PROGRESS}
        sx={{
          width: 244,
          height: 'auto',
          mt: 2,
        }}
      />
      <Typography fontSize={'clamp(20px,3.2vw,24px)'} variant={'h4'}>
        What&apos;s happening?
      </Typography>
      <Typography component={'div'} textAlign={'center'}>
        <Typography variant={'body1'}>
          We&apos;re working hard to bring you a seamless way to access our{' '}
          <strong>Point of Sale</strong> system directly from our{' '}
          <strong>Document Portal</strong>.
        </Typography>
        <Typography variant={'body1'}>
          This feature will give you real-time updates on your loan details and
          progress.
        </Typography>
      </Typography>

      <Stack alignItems={'center'} gap={3} mt={7}>
        How helpful would this feature be?
        <Rating
          onChange={async (event, newValue) => {
            setValue(newValue);
            await _portalRating({ loanId, score: newValue });
          }}
          sx={{
            fontSize: 36,
          }}
          value={value}
        />
      </Stack>
      <StyledButton
        color={'info'}
        onClick={() => cb?.()}
        sx={{
          mt: 8,
          width: 140,
        }}
        variant={'outlined'}
      >
        Back
      </StyledButton>
    </Stack>
  );
};
