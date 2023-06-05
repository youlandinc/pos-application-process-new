import {
  DashboardTaskExitStrategy,
  DashboardTaskPrimaryReasonRefinance,
} from '@/types';
import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';

import {
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_EXIT_STRATEGY,
  OPTIONS_TASK_PRIMARY_REASON,
} from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledSelectOption,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

export const BridgeRefinanceTaskLoanDetails: FC = () => {
  const router = useRouter();

  const [purchasePrice, setPurchasePrice] = useState<number | undefined>();
  const [propertyPrice, setPropertyPrice] = useState<number | undefined>();
  const [rehabFunds, setRehabFunds] = useState<boolean>(false);
  const [loanAmount, setLoanAmount] = useState<number | undefined>();
  const [date, setDate] = useState<unknown | Date | null>();
  const [repairCosts, setRepairCosts] = useState<number | undefined>();
  const [primaryReason, setPrimaryReason] = useState<
    DashboardTaskPrimaryReasonRefinance | undefined
  >();
  const [exitStrategy, setExitStrategy] = useState<
    DashboardTaskExitStrategy | undefined
  >();

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
        sub
        tip={
          'The price you paid or are paying for the property that the loan is for.'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Purchase Price'}
            onValueChange={({ floatValue }) => {
              setPurchasePrice(floatValue);
            }}
            prefix={'$'}
            value={purchasePrice}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'As-is property value'}
        sub
        tip={
          'Your estimate of the current value of the property (before any rehabilitation).'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'As-is Property Value'}
            onValueChange={({ floatValue }) => {
              setPropertyPrice(floatValue);
            }}
            prefix={'$'}
            value={propertyPrice}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'Will you request rehab funds?'} sub>
        <Stack maxWidth={600} width={'100%'}>
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
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display: rehabFunds ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        {rehabFunds && (
          <>
            <StyledFormItem
              label={'Estimated rehab loan amount'}
              sub
              tip={
                'Total cost that you would like {Organization Name} to finance.'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Estimated Rehab Loan Amount'}
                  onValueChange={({ floatValue }) => {
                    setLoanAmount(floatValue);
                  }}
                  prefix={'$'}
                  value={loanAmount}
                />
              </Stack>
            </StyledFormItem>
            <StyledFormItem
              label={'Estimated date to finish your rehab project'}
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
            <StyledFormItem
              label={'After repair value'}
              sub
              tip={
                'Once all improvements to the property have been made, how much will the property be worth?'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'After repair property value'}
                  onValueChange={({ floatValue }) => {
                    setRepairCosts(floatValue);
                  }}
                  prefix={'$'}
                  value={repairCosts}
                />
              </Stack>
            </StyledFormItem>
          </>
        )}
      </Transitions>

      <StyledFormItem
        label={'What is your primary reason for refinancing your current loan?'}
        sub
        tip={
          'When you refinance, you can take out cash from your home equity to help you pay for home improvements, pay off higher-interest debts (this is known as debt consolidation), or pay for other expenses.'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              setPrimaryReason(value as DashboardTaskPrimaryReasonRefinance);
            }}
            options={OPTIONS_TASK_PRIMARY_REASON}
            value={primaryReason}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'Exit strategy'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              setExitStrategy(value as DashboardTaskExitStrategy);
            }}
            options={OPTIONS_TASK_EXIT_STRATEGY}
            value={exitStrategy}
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
};
