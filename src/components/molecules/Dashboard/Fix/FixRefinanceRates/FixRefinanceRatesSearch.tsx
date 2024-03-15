import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { addDays, compareDesc, isValid as dateValid, isDate } from 'date-fns';

import { FRQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import { POSFormatDollar, POSFormatPercent } from '@/utils';

import {
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';

interface FixRefinanceRatesSearchProps {
  searchForm: FRQueryData;
  setSearchForm: Dispatch<SetStateAction<FRQueryData>>;
  loading: boolean;
  userType: UserType;
  loanStage?: LoanStage;
  isDashboard?: boolean;
  id?: string;
}

export const FixRefinanceRatesSearch: FC<FixRefinanceRatesSearchProps> = ({
  loading,
  //loanStage = LoanStage.Application,
  searchForm,
  setSearchForm,
  userType,
  isDashboard = false,
  id,
}) => {
  const {
    cor,
    isCashOut,
    cashOutAmount,
    balance,
    homeValue,
    arv,
    brokerPoints,
    brokerProcessingFee,
    officerPoints,
    officerProcessingFee,
    agentFee,
    lenderProcessingFee,
    lenderPoints,
    closeDate,
  } = searchForm;

  const [date, setDate] = useState<null | Date | string>(
    isDashboard ? closeDate || addDays(new Date(), 7) : addDays(new Date(), 7),
  );

  const closeDateError = useMemo(() => {
    if (!dateValid(date)) {
      return ['Please select or enter a valid date'];
    }

    if (isDate(date) && compareDesc(new Date(), date as Date) === -1) {
      return ['Date out of range, please enter a future date.'];
    }

    return undefined;
  }, [date]);

  const loanAmount = useMemo(() => {
    let total = 0;
    total += balance || 0;
    total += cor || 0;
    if (isCashOut) {
      total! += cashOutAmount || 0;
    }
    return total;
  }, [balance, cashOutAmount, cor, isCashOut]);

  const LTV = useMemo(() => {
    if (!homeValue) {
      return 0;
    }
    let total = balance || 0;
    if (isCashOut) {
      total += cashOutAmount || 0;
    }
    return total / homeValue;
  }, [homeValue, balance, isCashOut, cashOutAmount]);

  const LTC = useMemo(() => {
    return cor === 0 ? 0 : loanAmount! / (cor! + homeValue!);
  }, [cor, homeValue, loanAmount]);

  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <StyledFormItem
            gap={3}
            label={'Broker compensation'}
            labelSx={{
              m: 0,
              textAlign: 'left',
              color: 'info.dark',
              fontWeight: 400,
              fontSize: 20,
              pl: '4px',
            }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  decimalScale={3}
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Broker origination fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      brokerPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  value={brokerPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Broker processing fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      brokerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={brokerProcessingFee}
                />
              </Stack>
            </Stack>
          </StyledFormItem>
        );
      case UserType.LENDER:
        return (
          <StyledFormItem
            gap={3}
            label={'Lender compensation'}
            labelSx={{
              m: 0,
              textAlign: 'left',
              color: 'info.dark',
              fontWeight: 400,
              fontSize: 20,
              pl: '4px',
            }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  decimalScale={3}
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Lender origination fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      lenderPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  value={lenderPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Lender processing fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      lenderProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={lenderProcessingFee}
                />
              </Stack>
            </Stack>
          </StyledFormItem>
        );
      case UserType.LOAN_OFFICER:
        return (
          <StyledFormItem
            gap={3}
            label={'Loan officer compensation'}
            labelSx={{
              m: 0,
              textAlign: 'left',
              color: 'info.dark',
              fontWeight: 400,
              fontSize: 20,
              pl: '4px',
            }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  decimalScale={3}
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Loan officer origination fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      officerPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  value={officerPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Loan officer processing fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      officerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={officerProcessingFee}
                />
              </Stack>
            </Stack>
          </StyledFormItem>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <StyledFormItem
            gap={3}
            label={'Real estate agent compensation'}
            labelSx={{
              m: 0,
              textAlign: 'left',
              color: 'info.dark',
              fontWeight: 400,
              fontSize: 20,
              pl: '4px',
            }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  //disabled={loading || loanStage === LoanStage.Approved}
                  label={'Real estate agent fee'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      agentFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={agentFee}
                />
              </Stack>
            </Stack>
          </StyledFormItem>
        );
      case UserType.CUSTOMER:
        return null;
      default:
        return null;
    }
  }, [
    agentFee,
    brokerPoints,
    brokerProcessingFee,
    lenderPoints,
    lenderProcessingFee,
    //loading,
    //loanStage,
    officerPoints,
    officerProcessingFee,
    searchForm,
    setSearchForm,
    userType,
  ]);

  return (
    <StyledFormItem
      gap={4}
      id={id}
      label={
        isDashboard
          ? 'View other rates'
          : 'Estimate your fix and flip loan rate'
      }
      labelSx={{ m: 0 }}
    >
      {!isDashboard && (
        <StyledFormItem
          alignItems={'flex-start'}
          gap={3}
          label={
            <Stack
              alignItems={'center'}
              color={'info.dark'}
              flexDirection={'row'}
              gap={1}
            >
              Preferred closing date
              <StyledTooltip
                title={
                  '"Preferred closing date" is the date on which you wish to complete a real estate transaction or loan application. We will stay in touch with you to ensure that the transaction is completed at the most suitable time.'
                }
              >
                <InfoOutlined
                  sx={{
                    width: 16,
                    height: 16,
                    mb: 0.125,
                    color: 'info.dark',
                  }}
                />
              </StyledTooltip>
            </Stack>
          }
          labelSx={{
            m: 0,
            textAlign: 'left',
            color: 'info.dark',
            fontWeight: 400,
            fontSize: 20,
            pl: '4px',
          }}
          maxWidth={900}
          sub
          sx={{ mb: userType === UserType.CUSTOMER ? 0 : 3 }}
          width={'100%'}
        >
          <StyledDatePicker
            disableFuture={false}
            disablePast
            label={'Preferred closing date'}
            onChange={(value) => {
              setSearchForm({
                ...searchForm,
                closeDate: value as Date,
              });
              setDate(value as Date);
            }}
            validate={closeDateError}
            value={date}
          />
        </StyledFormItem>
      )}

      <StyledFormItem
        alignItems={'flex-start'}
        gap={3}
        label={'Loan details'}
        labelSx={{
          m: 0,
          textAlign: 'left',
          color: 'info.dark',
          fontWeight: 400,
          fontSize: 20,
          pl: '4px',
        }}
        maxWidth={900}
        sub
        sx={{ mb: 3 }}
        width={'100%'}
      >
        <Stack gap={0.5} width={'100%'}>
          <Stack
            flexDirection={{ lg: 'row', xs: 'column' }}
            gap={3}
            width={'100%'}
          >
            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'As-is property value'}
              onValueChange={({ floatValue }) => {
                setSearchForm({
                  ...searchForm,
                  homeValue: floatValue,
                });
              }}
              prefix={'$'}
              value={homeValue}
            />

            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'Payoff amount'}
              onValueChange={({ floatValue }) => {
                setSearchForm({
                  ...searchForm,
                  balance: floatValue,
                });
              }}
              prefix={'$'}
              value={balance}
            />
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={0.5}
            justifyContent={'flex-start'}
            pl={0.5}
            width={{ lg: 'calc(50% - 12px)', xs: '100%' }}
          >
            <Typography color={'info.main'} variant={'body2'}>
              Loan to value
            </Typography>
            <StyledTooltip
              title={
                'LTV = Payoff amount + Cash out (if any) / As-is property value'
              }
            >
              <InfoOutlined
                sx={{ width: 14, height: 14, mb: 0.125, color: 'info.main' }}
              />
            </StyledTooltip>
            <Typography color={'info.main'} ml={'auto'} variant={'body2'}>
              {POSFormatPercent(LTV)}
            </Typography>
          </Stack>
        </Stack>

        <Stack gap={0.5} width={'100%'}>
          <Stack
            flexDirection={{ lg: 'row', xs: 'column' }}
            gap={3}
            width={'100%'}
          >
            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'Estimated rehab loan amount'}
              onValueChange={({ floatValue }) => {
                setSearchForm({
                  ...searchForm,
                  cor: floatValue,
                });
              }}
              prefix={'$'}
              value={cor}
            />

            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'After repair value (ARV)'}
              onValueChange={({ floatValue }) => {
                setSearchForm({
                  ...searchForm,
                  arv: floatValue,
                });
              }}
              prefix={'$'}
              value={arv}
            />
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={0.5}
            justifyContent={'flex-start'}
            pl={0.5}
            width={{ lg: 'calc(50% - 12px)', xs: '100%' }}
          >
            <Typography color={'info.main'} variant={'body2'}>
              Loan to cost
            </Typography>
            <StyledTooltip
              title={
                'LTC = Total loan amount / (As-is property value + Estimated rehab loan amount)'
              }
            >
              <InfoOutlined
                sx={{ width: 14, height: 14, mb: 0.125, color: 'info.main' }}
              />
            </StyledTooltip>
            <Typography color={'info.main'} ml={'auto'} variant={'body2'}>
              {POSFormatPercent(LTC)}
            </Typography>
          </Stack>
        </Stack>

        <Stack gap={1} width={'100%'}>
          <StyledCheckbox
            checked={isCashOut}
            disabled={loading}
            label={'Cash out amount'}
            onChange={(e) => {
              setSearchForm({
                ...searchForm,
                isCashOut: e.target.checked,
              });
            }}
          />

          <Transitions
            style={{
              width: '100%',
              display: isCashOut ? 'block' : 'none',
            }}
          >
            {isCashOut && (
              <StyledTextFieldNumber
                //disabled={loading || loanStage === LoanStage.Approved}
                label={'Cash out amount'}
                onValueChange={({ floatValue }) => {
                  setSearchForm({
                    ...searchForm,
                    cashOutAmount: floatValue,
                  });
                }}
                prefix={'$'}
                value={cashOutAmount}
              />
            )}
          </Transitions>
        </Stack>
      </StyledFormItem>

      {renderByUserType}

      <Stack
        alignItems={'stretch'}
        flexDirection={'row'}
        gap={0.5}
        justifyContent={'flex-end'}
        width={'100%'}
      >
        <Typography
          color={'info.main'}
          component={'div'}
          textAlign={'right'}
          variant={'h7'}
          width={'100%'}
        >
          Total loan amount:
        </Typography>
        <Typography
          color={'primary.main'}
          component={'div'}
          mt={'-3px'}
          textAlign={'right'}
          variant={'h5'}
        >
          {POSFormatDollar(loanAmount)}
        </Typography>
      </Stack>
    </StyledFormItem>
  );
};
