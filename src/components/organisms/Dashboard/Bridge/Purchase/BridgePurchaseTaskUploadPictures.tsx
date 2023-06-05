import { FC } from 'react';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

// import { BridgePurchasePaymentSummary, PaymentTask } from '@/components/molecules';

import { Stack } from '@mui/material';
import {
  StyledButton,
  StyledFormItem,
  StyledUploadBox,
} from '@/components/atoms';

export const BridgePurchaseTaskUploadPictures: FC = observer(() => {
  // const {

  // } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  return (
    <StyledFormItem
      gap={6}
      label={'Upload Pictures (Optional)'}
      tip={
        'Please upload photos of the subject property that are no more than 6 months old. The more photos you provide, the more accurately we can value the property and determine the feasibility of your project. If you do not provide adequate interior pictures of the subject property, we will assume C5-6 condition.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'Please upload the following:'}
        maxWidth={900}
        sub
        tip={
          '1.Kitchen (2-3), 2. Bedroom, 3. Bathroom, 4. Front of house, 5. Back of house, 6. Sides of house, 7. General (optional)'
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
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
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
