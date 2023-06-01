import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
} from '@/components/atoms';
import { OPTIONS_COMMON_YES_OR_NO } from '@/constants';
import { Stack } from '@mui/material';
import { FC, useState } from 'react';

export const BridgePurchaseTaskLoanDetails: FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number | undefined>(0);
  const [propertyPrice, setPropertyPrice] = useState<number | undefined>(0);
  const [rehabFunds, setRehabFunds] = useState<boolean>(false);
  const [loanAmount, setLoanAmount] = useState<number | undefined>(0);
  const [date, setDate] = useState<Date | null>();
  const [repairCosts, setRepairCosts] = useState<number | undefined>(0);

  return (
    <StyledFormItem
      gap={6}
      label={'Loan Details'}
      tip={
        'Below are all of the details we have about your deal. If you have to change these details you may do so below, please note that changes may affect your Loan-to-Value or your rate.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem
        label={'Purchase price'}
        maxWidth={600}
        sub
        tip={
          'The price you paid or are paying for the property that the loan is for.'
        }
      >
        <StyledTextFieldNumber
          label={'Purchase Price'}
          onValueChange={({ floatValue }) => {
            setPurchasePrice(floatValue);
          }}
          prefix={'$'}
          value={purchasePrice}
        />
      </StyledFormItem>

      <StyledFormItem
        label={'As-is property value'}
        maxWidth={600}
        sub
        tip={
          'Your estimate of the current value of the property (before any rehabilitation).'
        }
      >
        <StyledTextFieldNumber
          label={'Property Value'}
          onValueChange={({ floatValue }) => {
            setPropertyPrice(floatValue);
          }}
          prefix={'$'}
          value={propertyPrice}
        />
      </StyledFormItem>
      <StyledFormItem
        label={'Will you request rehab funds?'}
        maxWidth={600}
        sub
      >
        <StyledButtonGroup
          onChange={(e, value) => {
            if (value !== null) {
              setRehabFunds(value === 'yes');
            }
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={rehabFunds}
        />
      </StyledFormItem>

      <StyledFormItem
        label={'Estimated rehab loan amount'}
        maxWidth={600}
        sub
        tip={'Total cost that you would like {Organization Name} to finance.'}
      >
        <StyledTextFieldNumber
          label={'Estimated Rehab Loan Amount'}
          onValueChange={({ floatValue }) => {
            setLoanAmount(floatValue);
          }}
          prefix={'$'}
          value={loanAmount}
        />
      </StyledFormItem>

      <StyledFormItem
        label={'Estimated date to finish your rehab project'}
        maxWidth={600}
        sub
      >
        <StyledDatePicker
          label={'Date of Birth'}
          onChange={(date) => {
            setDate(date);
          }}
          //validate={}
          value={date}
        />
      </StyledFormItem>
      <StyledFormItem
        label={'After repair value'}
        maxWidth={600}
        sub
        tip={
          'Once all improvements to the property have been made, how much will the property be worth?'
        }
      >
        <StyledTextFieldNumber
          label={'After repair property value'}
          onValueChange={({ floatValue }) => {
            setRepairCosts(floatValue);
          }}
          prefix={'$'}
          value={repairCosts}
        />
      </StyledFormItem>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton color={'info'} variant={'text'} sx={{ flex: 1 }}>
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
};
