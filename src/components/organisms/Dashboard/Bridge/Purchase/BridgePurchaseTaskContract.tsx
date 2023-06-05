import { FC, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';

import { Box, Stack } from '@mui/material';
import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledUploadBox,
} from '@/components/atoms';

import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';

export const BridgePurchaseTaskContract: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [accepted, setAccepted] = useState(true);
  const [date, setDate] = useState<string | Date>('');

  return (
    <StyledFormItem
      gap={6}
      label={'Upload Your Purchase Contract'}
      tip={
        'Please upload a purchase contract with the exact same address and buyer name as your submitted loan application.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'Is the title company also managing loan closing?'}
        maxWidth={600}
        sub
      >
        <StyledButtonGroup
          onChange={(e, value) => {
            if (value !== null) {
              setAccepted(value === 'yes');
            }
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={accepted}
        />
      </StyledFormItem>

      <StyledFormItem label={'Contract end date'} maxWidth={600} sub>
        <StyledDatePicker
          label={'MM/DD/YYYY'}
          onChange={(date) => setDate(date as string | Date)}
          value={date}
        />
      </StyledFormItem>
      <StyledFormItem
        label={'Why do we need this?'}
        maxWidth={900}
        sub
        tip={
          <>
            <Box>
              We’ll confirm that all of the details in the purchase contract
              match your application. YouLand will look for the agreed-upon
              purchase price, any Sellers concessions and fees, close of escrow
              date, and confirmation that the property is being used for
              investment purposes.
            </Box>
            <Box>
              Check for initials and signatures. The Purchase Contract must be
              fully executed with initials and signatures in all designated
              places, along with all of the contract pages and any additional
              addendums.
            </Box>
          </>
        }
      >
        <StyledUploadBox
          fileList={[]}
          onDelete={() => {
            console.log('onDelete');
          }}
          onSuccess={() => {
            console.log('onSuccess');
          }}
        />
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
