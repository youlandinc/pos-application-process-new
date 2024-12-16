import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Stack, Typography } from '@mui/material';
import { StyledButton } from '@/components/atoms';

export const SubmitLeadSuccess: FC<FormNodeBaseProps> = observer(() => {
  return (
    <Stack gap={{ xs: 6, lg: 10 }} m={'0 auto'} maxWidth={600} width={'100%'}>
      <Icon />
      <Typography>Thank you!</Typography>
      <Typography>
        We&apos;ve received your loan request and are reviewing it now.
        You&apos;ll hear from us soon with the next steps.
      </Typography>
      <StyledButton>Back to landing page</StyledButton>
    </Stack>
  );
});
