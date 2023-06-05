import { FC, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';

import {
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_EXIT_STRATEGY,
  OPTIONS_TASK_PRIMARY_REASON,
} from '@/constants';
import {
  DashboardTaskExitStrategy,
  DashboardTaskPrimaryReasonRefinance,
} from '@/types';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledSelectOption,
  StyledTextField,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';

export const BridgeRefinanceTaskLoanDetails: FC = () => {
  const router = useRouter();

  const [homeValue, setHomeValue] = useState<number | undefined>();
  const [balance, setBalance] = useState<number | undefined>();

  const [isCashOut, setIsCashOut] = useState<boolean | undefined>();
  const [cashOutAmount, setCashOutAmount] = useState<number | undefined>();

  const [isCor, setIsCor] = useState<boolean | undefined>();
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
      <StyledFormItem label={'Estimated Home Value'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Estimated Home Value'}
            onValueChange={({ floatValue }) => {
              setHomeValue(floatValue);
            }}
            prefix={'$'}
            value={homeValue}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'Remaining Loan Balance'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Remaining Loan Balance'}
            onValueChange={({ floatValue }) => {
              setBalance(floatValue);
            }}
            prefix={'$'}
            value={balance}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'Will you request cash out?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value !== null) {
                setIsCashOut(value === 'yes');
              }
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={isCashOut}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display: isCashOut ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 48,
          width: '100%',
        }}
      >
        {isCashOut && (
          <StyledFormItem label={'Will you request cash out?'} sub>
            <Stack maxWidth={600} width={'100%'}>
              <StyledTextFieldNumber
                label={'Remaining Loan Balance'}
                onValueChange={({ floatValue }) => {
                  setCashOutAmount(floatValue);
                }}
                prefix={'$'}
                value={cashOutAmount}
              />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>

      <StyledFormItem label={'Will you request rehab funds?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledButtonGroup
            onChange={(e, value) => {
              if (value !== null) {
                setIsCor(value === 'yes');
              }
            }}
            options={OPTIONS_COMMON_YES_OR_NO}
            sx={{ width: '100%', maxWidth: 600 }}
            value={isCor}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display: isCor ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        {isCor && (
          <>
            <StyledFormItem
              label={'Cash Out Amount'}
              sub
              tip={
                'Total cost that you would like {Organization Name} to finance.'
              }
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  label={'Cash Out Amount'}
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
