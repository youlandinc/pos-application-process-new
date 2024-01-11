import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { addDays, compareDesc, isValid as dateValid, isDate } from 'date-fns';

import { BRQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import { POSFormatDollar, POSFormatPercent } from '@/utils';

import {
  StyledButton,
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';
import { User } from '@/types/user';
import { useSessionStorageState } from '@/hooks';

interface BridgeRefinanceRatesSearchProps {
  onCheck: () => void;
  searchForm: BRQueryData;
  setSearchForm: Dispatch<SetStateAction<BRQueryData>>;
  loading: boolean;
  userType: UserType;
  loanStage?: LoanStage;
  isDashboard?: boolean;
  id?: string;
}

export const BridgeRefinanceRatesSearch: FC<
  BridgeRefinanceRatesSearchProps
> = ({
  onCheck,
  searchForm,
  setSearchForm,
  loading,
  userType,
  loanStage = LoanStage.Application,
  isDashboard = false,
  id,
}) => {
  const {
    isCashOut,
    cashOutAmount,
    balance,
    homeValue,
    brokerPoints,
    brokerProcessingFee,
    officerPoints,
    officerProcessingFee,
    agentFee,
    lenderProcessingFee,
    lenderPoints,
    closeDate,
    customRate,
    interestRate,
    loanTerm,
  } = searchForm;

  const { saasState } = useSessionStorageState('tenantConfig');

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
    let total = balance;

    if (isCashOut) {
      total! += cashOutAmount || 0;
    }
    return total;
  }, [balance, cashOutAmount, isCashOut]);

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
                  disabled={loading || loanStage === LoanStage.Approved}
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
                  disabled={loading || loanStage === LoanStage.Approved}
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

            <Stack gap={3} maxWidth={900} width={'100%'}>
              <StyledCheckbox
                checked={customRate}
                label={
                  <Typography color={'text.primary'} ml={2} variant={'body2'}>
                    Use custom loan terms
                  </Typography>
                }
                onChange={(e) =>
                  setSearchForm({
                    ...searchForm,
                    customRate: e.target.checked,
                  })
                }
              />
              <Transitions
                style={{
                  display: customRate ? 'block' : 'none',
                  width: '100%',
                }}
              >
                {customRate && (
                  <Stack
                    flexDirection={{ lg: 'row', xs: 'column' }}
                    gap={3}
                    width={'100%'}
                  >
                    <Stack flex={1} gap={1}>
                      <StyledTextFieldNumber
                        decimalScale={3}
                        disabled={loading || loanStage === LoanStage.Approved}
                        label={'Interest rate'}
                        onValueChange={({ floatValue }) => {
                          setSearchForm({
                            ...searchForm,
                            interestRate: floatValue,
                          });
                        }}
                        percentage
                        suffix={'%'}
                        thousandSeparator={false}
                        value={interestRate}
                      />
                    </Stack>
                    <Stack flex={1} gap={1}>
                      <StyledTextFieldNumber
                        decimalScale={0}
                        disabled={loading || loanStage === LoanStage.Approved}
                        label={'Loan term (months)'}
                        onValueChange={({ floatValue }) => {
                          setSearchForm({
                            ...searchForm,
                            loanTerm: floatValue,
                          });
                        }}
                        percentage={false}
                        thousandSeparator={false}
                        value={loanTerm}
                      />
                    </Stack>
                  </Stack>
                )}
              </Transitions>
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
                  disabled={loading || loanStage === LoanStage.Approved}
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
                  disabled={loading || loanStage === LoanStage.Approved}
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
                  disabled={loading || loanStage === LoanStage.Approved}
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
                  disabled={loading || loanStage === LoanStage.Approved}
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
                  disabled={loading || loanStage === LoanStage.Approved}
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
    customRate,
    interestRate,
    lenderPoints,
    lenderProcessingFee,
    loading,
    loanStage,
    loanTerm,
    officerPoints,
    officerProcessingFee,
    searchForm,
    setSearchForm,
    userType,
  ]);

  const renderCustomRateByConfig = useMemo(() => {
    const original = saasState?.posSettings?.customLoanTerms?.reduce(
      (acc: string[], cur: User.POSBorrowerTypes) => {
        if (cur.allowed) {
          acc.push(cur.key);
        }
        return acc;
      },
      [],
    );

    if (!original?.length || !original.includes(userType)) {
      return null;
    }

    return (
      <Stack gap={3} maxWidth={900} width={'100%'}>
        <StyledCheckbox
          checked={customRate}
          label={
            <Typography color={'text.primary'} ml={2} variant={'body2'}>
              Use custom loan terms
            </Typography>
          }
          onChange={(e) =>
            setSearchForm({
              ...searchForm,
              customRate: e.target.checked,
            })
          }
        />
        <Transitions
          style={{
            display: customRate ? 'block' : 'none',
            width: '100%',
          }}
        >
          {customRate && (
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={loading || loanStage === LoanStage.Approved}
                  label={'Interest rate'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      interestRate: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  value={interestRate}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <StyledTextFieldNumber
                  decimalScale={0}
                  disabled={loading || loanStage === LoanStage.Approved}
                  label={'Custom loan term (months)'}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      loanTerm: floatValue,
                    });
                  }}
                  percentage={false}
                  thousandSeparator={false}
                  value={loanTerm}
                />
              </Stack>
            </Stack>
          )}
        </Transitions>
      </Stack>
    );
  }, [
    customRate,
    interestRate,
    loading,
    loanStage,
    loanTerm,
    saasState?.posSettings?.customLoanTerms,
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
          : 'Estimate your stabilized bridge loan rate'
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
              disabled={loading || loanStage === LoanStage.Approved}
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
              disabled={loading || loanStage === LoanStage.Approved}
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
                'LTV [Payoff amount + Cash out (if any)] / As-is property value'
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

        <Stack gap={1} width={'100%'}>
          <StyledCheckbox
            checked={isCashOut}
            disabled={loading || loanStage === LoanStage.Approved}
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
                disabled={loading || loanStage === LoanStage.Approved}
                label={'Cash out amount'}
                onValueChange={({ floatValue }) => {
                  setSearchForm({
                    ...searchForm,
                    cashOutAmount: floatValue,
                  });
                }}
                prefix={'$'}
                value={cashOutAmount || undefined}
              />
            )}
          </Transitions>
        </Stack>
      </StyledFormItem>

      {renderByUserType}
      {renderCustomRateByConfig}

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

      <StyledButton
        disabled={
          !!closeDateError || loading || loanStage === LoanStage.Approved
        }
        onClick={onCheck}
        sx={{ width: 200, mt: 3 }}
      >
        {customRate ? 'Next' : 'Check'}
      </StyledButton>
    </StyledFormItem>
  );
};
