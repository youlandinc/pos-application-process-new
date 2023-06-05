import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { Address, IAddress } from '@/models/common/Address';
import {
  OPTIONS_TASK_CITIZENSHIP_STATUS,
  OPTIONS_TASK_MARTIAL_STATUS,
} from '@/constants';
import {
  DashboardTaskCitizenshipStatus,
  DashboardTaskMaritalStatus,
} from '@/types';

import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  StyledTextFieldNumber,
} from '@/components/atoms';

export const BridgePurchaseTaskPersonalDetails: FC = observer(() => {
  const router = useRouter();

  const [citizenshipStatus, setCitizenshipStatus] = useState<
    DashboardTaskCitizenshipStatus | undefined
  >();
  const [maritalStatus, setMaritalStatus] = useState<
    DashboardTaskMaritalStatus | undefined
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
  const [delinquentTimes, setDelinquentTimes] = useState<string | undefined>();
  const [date, setDate] = useState<unknown | Date | null>();

  return (
    <StyledFormItem
      gap={6}
      label={'Personal Details'}
      tip={
        'Please enter and confirm all of your personally identifiable information so we may begin processing your application.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'What is your citizenship status?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) =>
              setCitizenshipStatus(
                value as string as DashboardTaskCitizenshipStatus,
              )
            }
            options={OPTIONS_TASK_CITIZENSHIP_STATUS}
            value={citizenshipStatus}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'What is your marital status?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) =>
              setMaritalStatus(value as string as DashboardTaskMaritalStatus)
            }
            options={OPTIONS_TASK_MARTIAL_STATUS}
            value={maritalStatus}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'Current Address'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledGoogleAutoComplete address={address} />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={
          'In the past 3 years, how many times have you had a credit account with 60 or more days delinquent?'
        }
        sub
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Delinquent Times'}
            onValueChange={({ formattedValue }) => {
              setDelinquentTimes(formattedValue);
            }}
            thousandSeparator={false}
            value={delinquentTimes}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={
          'Please provide the discharge date of your most recent bankruptcy event, If applicable.'
        }
        sub
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledDatePicker
            label={'MM/DD/YYYY'}
            onChange={(date) => {
              setDate(date);
            }}
            //validate={}
            value={date}
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
