import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';

import { OPTIONS_TASK_BORROWER_TYPE } from '@/constants';
import { Address, IAddress } from '@/models/common/Address';
import { DashboardTaskBorrowerType } from '@/types';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

export const BridgePurchaseTaskGuarantorPersonal: FC = observer(() => {
  const router = useRouter();

  const [borrowerType, setBorrowerType] = useState<
    DashboardTaskBorrowerType | undefined
  >();
  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  return (
    <StyledFormItem
      gap={6}
      label={'Guarantor Details'}
      tip={
        'If you represent an entity, please update the borrower type below, and we will convert the previously filled borrower information into a guarantor for this entity.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Borrower Type'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) =>
              setBorrowerType(value as string as DashboardTaskBorrowerType)
            }
            options={OPTIONS_TASK_BORROWER_TYPE}
            value={borrowerType}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display:
            borrowerType === DashboardTaskBorrowerType.entity ? 'flex' : 'none',
          width: '100%',
        }}
      >
        {borrowerType === DashboardTaskBorrowerType.entity && (
          <StyledFormItem label={'Entity Information'} sub>
            <Stack maxWidth={600} width={'100%'}>
              <StyledGoogleAutoComplete address={address} />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>

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
