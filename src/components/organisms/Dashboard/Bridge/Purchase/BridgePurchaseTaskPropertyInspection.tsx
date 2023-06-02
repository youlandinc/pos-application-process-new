import { FC, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';

import { Stack } from '@mui/material';
import {
  StyledButton,
  StyledFormItem,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

export const BridgePurchaseTaskPropertyInspection: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [contactName, setContactName] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [instructions, setInstructions] = useState<string | number>('');

  return (
    <StyledFormItem
      gap={3}
      label={'Property Inspection Details'}
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        gap={3}
        label={'Property inspection contact information'}
        labelSx={{ mb: 0 }}
        maxWidth={600}
        sub
      >
        <Stack width={'100%'}>
          <StyledTextField label={'Contact Name'} value={contactName} />
        </Stack>

        <Stack
          flexDirection={{ lg: 'row', xs: 'column' }}
          gap={3}
          width={'100%'}
        >
          <StyledTextFieldPhone
            label={'Phone Number'}
            onValueChange={({ value }) => setPhone(value)}
            value={phone}
          />
          <StyledTextField label={'Email'} value={email} />
        </Stack>
        <Stack width={'100%'}>
          <StyledTextField
            label={'Property Access Instructions'}
            value={instructions}
          />
        </Stack>
      </StyledFormItem>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() => router.push('/dashboard/tasks')}
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
