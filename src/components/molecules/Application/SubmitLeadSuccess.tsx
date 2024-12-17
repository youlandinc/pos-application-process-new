import { FC, useMemo } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { StyledButton } from '@/components/atoms';

import ICON_THANK_YOU from './assets/icon-thank-you.svg';

export const SubmitLeadSuccess: FC<FormNodeBaseProps> = observer(
  ({ nextStep }) => {
    const { session } = useMst();

    const hasSession = useMemo<boolean>(() => !!session, [session]);

    return (
      <Stack alignItems={'center'} m={'0 auto'} maxWidth={900} width={'100%'}>
        <Icon component={ICON_THANK_YOU} sx={{ width: 280, height: 220 }} />
        <Typography fontSize={'clamp(20px,3.2vw,30px)'} fontWeight={600} mt={3}>
          Thank you!
        </Typography>
        <Typography color={'text.secondary'} mt={1.5}>
          We&apos;ve received your loan request and are reviewing it now.
          You&apos;ll hear from us soon with the next steps.
        </Typography>

        <StyledButton onClick={nextStep} sx={{ mt: 10, width: 276 }}>
          {hasSession ? 'Continue' : 'Back to landing page'}
        </StyledButton>
      </Stack>
    );
  },
);
