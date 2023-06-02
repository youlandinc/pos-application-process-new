import { FC, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';

import { Box, Stack } from '@mui/material';
import {
  StyledButton,
  StyledFormItem,
  StyledUploadButtonBox,
} from '@/components/atoms';

export const BridgePurchaseTaskDocuments: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [accepted, setAccepted] = useState(true);
  const [date, setDate] = useState<string | Date>('');

  return (
    <StyledFormItem gap={3} label={'Documents & Materials'}>
      <Stack gap={6} maxWidth={900} width={'100%'}>
        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'1003 Form'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>
        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Personal identification of guarantor and/or borrower'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'W9 Form'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Borrower authorization form'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Proof of Liquidity (Bank Statement)'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Prelim or title commitment'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={
              'Certificates of formation/Filed articles of organization/incorporation'
            }
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Operating agreement/partnership agreement/by laws'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledUploadButtonBox
            fileList={[]}
            label={'Certificate of good standing from state of organization'}
            onDelete={() => {
              console.log('onDelete');
            }}
            onSuccess={() => {
              console.log('onSuccess');
            }}
          />
        </Stack>
      </Stack>

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
