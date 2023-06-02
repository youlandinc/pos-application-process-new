import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { StyledButton, StyledFormItem } from '@/components/atoms';

export const BridgePurchaseTaskDemographicsInformation: FC = observer(() => {
  const router = useRouter();

  return (
    <StyledFormItem
      gap={6}
      label={'Government Requested Information for you'}
      tip={
        'The following information is requested by the Federal Government for certain types of loans related to a dwelling in order to monitor the lender’s compliance with equal credit opportunity, fair housing, and home mortgage disclosure laws. The law provides that a lender may not discriminate either on the basis of this information, or whether you choose to disclose it. You may select one or more designations for Ethnicity and one or more designations for Race. You are not required to provide this information, but are encouraged to do so.'
      }
      tipSx={{ mb: 0 }}
    >
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
