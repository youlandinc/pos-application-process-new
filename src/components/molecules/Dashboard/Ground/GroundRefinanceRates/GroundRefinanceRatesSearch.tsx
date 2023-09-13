import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { addDays, compareDesc, isValid as dateValid, isDate } from 'date-fns';

import { OPTIONS_COMMON_USER_TYPE } from '@/constants';
import { GRQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import {
  StyledButton,
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';

import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSNotUndefined,
} from '@/utils';

interface GroundRefinanceRatesSearchProps {
  onCheck: () => void;
  searchForm: GRQueryData;
  setSearchForm: Dispatch<SetStateAction<GRQueryData>>;
  loading: boolean;
  userType: UserType;
  loanStage?: LoanStage;
  isDashboard?: boolean;
}

export const GroundRefinanceRatesSearch: FC<
  GroundRefinanceRatesSearchProps
> = ({
  onCheck,
  searchForm,
  setSearchForm,
  loading,
  userType,
  loanStage = LoanStage.Application,
  isDashboard = false,
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

  const [LTVError, setLTVError] = useState<string>('');
  const [LTCError, setLTCError] = useState<string>('');

  const [date, setDate] = useState<null | Date | string>(
    closeDate ? closeDate : addDays(new Date(), 7),
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
    let radio = 0.7;
    if (!homeValue) {
      return 0;
    }
    let total = balance || 0;
    if (isCashOut) {
      total += cashOutAmount || 0;
      radio = 0.65;
    } else {
      radio = 0.7;
    }
    setLTVError(
      total / homeValue <= radio
        ? ''
        : `Your LTV should be no more than ${radio * 100}%`,
    );
    if (loanAmount! < 100000) {
      setLTVError('Total loan amount must be at least $100,000');
    }
    return total / homeValue;
  }, [homeValue, balance, isCashOut, loanAmount, cashOutAmount]);

  const LTC = useMemo(() => {
    const result = cor === 0 ? 0 : loanAmount! / (cor! + homeValue!);
    setLTCError(
      result > 0.75
        ? 'Reduce your loan amount or rehab cost. Your loan-to-cost should be no more than 75%'
        : '',
    );
    return result;
  }, [cor, homeValue, loanAmount]);

  const pointsError = useMemo(() => {
    let points;
    switch (userType) {
      case UserType.BROKER:
        points = brokerPoints;
        break;
      case UserType.LENDER:
        points = lenderPoints;
        break;
      case UserType.LOAN_OFFICER:
        points = officerPoints;
        break;
      default:
        points = officerPoints;
        break;
    }
    if (!POSNotUndefined(points)) {
      return [''];
    }
    if (points! <= 5) {
      return undefined;
    }
    return [
      `${POSFindLabel(
        OPTIONS_COMMON_USER_TYPE,
        userType as string as UserType,
      )} origination fee must be lesser than or equal to 5%.`,
    ];
  }, [brokerPoints, officerPoints, userType, lenderPoints]);

  const processingFeeError = useMemo(() => {
    let fee;
    switch (userType) {
      case UserType.BROKER:
        fee = brokerProcessingFee;
        break;
      case UserType.LENDER:
        fee = lenderProcessingFee;
        break;
      case UserType.LOAN_OFFICER:
        fee = officerProcessingFee;
        break;
      default:
        fee = officerProcessingFee;
        break;
    }

    if (!POSNotUndefined(fee) || !loanAmount) {
      return [''];
    }
    if (fee! <= loanAmount) {
      return undefined;
    }
    return [
      `${POSFindLabel(
        OPTIONS_COMMON_USER_TYPE,
        userType as string as UserType,
      )} origination fee must be lesser than or equal to ${POSFormatDollar(
        loanAmount,
      )}.`,
    ];
  }, [
    brokerProcessingFee,
    loanAmount,
    officerProcessingFee,
    userType,
    lenderProcessingFee,
  ]);

  const agentFeeError = useMemo(() => {
    if (!POSNotUndefined(agentFee) || !loanAmount) {
      return [''];
    }
    if (agentFee! <= loanAmount) {
      return undefined;
    }
    return [
      `Real estate agent fee must be lesser than or equal to ${POSFormatDollar(
        loanAmount,
      )}.`,
    ];
  }, [agentFee, loanAmount]);

  const isValid = useMemo(() => {
    let flag: boolean;

    switch (userType) {
      case UserType.REAL_ESTATE_AGENT:
        flag = POSNotUndefined(agentFee) && !agentFeeError;
        break;
      case UserType.LOAN_OFFICER:
        flag =
          POSNotUndefined(officerPoints) &&
          POSNotUndefined(officerProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.BROKER:
        flag =
          POSNotUndefined(brokerPoints) &&
          POSNotUndefined(brokerProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.LENDER:
        flag =
          POSNotUndefined(lenderPoints) &&
          POSNotUndefined(lenderProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.CUSTOMER:
        flag = true;
        break;
      default:
        flag = true;
        break;
    }

    if (LTVError || LTCError) {
      return false;
    }
    if (!isCashOut) {
      return homeValue && POSNotUndefined(balance) && flag && cor && arv;
    }
    return (
      homeValue &&
      POSNotUndefined(balance) &&
      flag &&
      cor &&
      arv &&
      cashOutAmount
    );
  }, [
    userType,
    LTVError,
    LTCError,
    isCashOut,
    agentFee,
    agentFeeError,
    officerPoints,
    officerProcessingFee,
    pointsError,
    processingFeeError,
    brokerPoints,
    brokerProcessingFee,
    lenderPoints,
    lenderProcessingFee,
    homeValue,
    balance,
    cashOutAmount,
    cor,
    arv,
  ]);

  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <StyledFormItem
            gap={3}
            label={'Broker origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Broker origination fee</Typography>
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      brokerPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  validate={pointsError}
                  value={brokerPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography>Broker processing fee</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      brokerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  validate={processingFeeError}
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
            label={'Lender origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Lender origination fee</Typography>
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      lenderPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  validate={pointsError}
                  value={lenderPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography>Lender processing fee</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      lenderProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  validate={processingFeeError}
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
            label={'Loan officer origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Loan officer origination compensation</Typography>
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      officerPoints: floatValue,
                    });
                  }}
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  validate={pointsError}
                  value={officerPoints}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography>Loan officer processing fee</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      officerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  validate={processingFeeError}
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
            label={'Real estate agent origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={900}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>
                  Real estate agent origination compensation
                </Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      agentFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  validate={agentFeeError}
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
    agentFeeError,
    brokerPoints,
    brokerProcessingFee,
    lenderPoints,
    lenderProcessingFee,
    loading,
    loanStage,
    officerPoints,
    officerProcessingFee,
    pointsError,
    processingFeeError,
    searchForm,
    setSearchForm,
    userType,
  ]);

  return (
    <>
      <StyledFormItem
        gap={3}
        label={'Estimate your ground-up construction loan rate'}
        labelSx={{ m: 0 }}
      >
        {!isDashboard && (
          <StyledFormItem
            alignItems={'flex-start'}
            gap={3}
            label={'Prefer close date'}
            labelSx={{ textAlign: 'center', width: '100%' }}
            maxWidth={900}
            mt={3}
            sub
            tip={
              '"Preferred close date" is the date on which you wish to complete a real estate transaction or loan application. We will stay in touch with you to ensure that the transaction is completed at the most suitable time.'
            }
            width={'100%'}
          >
            <StyledDatePicker
              disableFuture={false}
              disablePast
              label={'Prefer close date'}
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
          label={`Total loan amount: ${POSFormatDollar(loanAmount)}`}
          labelSx={{ textAlign: 'center', width: '100%' }}
          maxWidth={900}
          mt={3}
          sub
          width={'100%'}
        >
          <Stack gap={1} width={'100%'}>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>As-is property value</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      homeValue: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={homeValue}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>Payoff amount</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
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
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              justifyContent={'flex-start'}
              width={{ md: 'calc(50% - 12px)', xs: '100%' }}
            >
              <Typography variant={'body1'}>Loan to value</Typography>
              <StyledTooltip
                title={
                  'LTV [Remaining balance + Cash out (if any)] / Home value'
                }
              >
                <InfoOutlined sx={{ width: 16, height: 16 }} />
              </StyledTooltip>
              <Typography ml={'auto'} variant={'body1'}>
                {POSFormatPercent(LTV)}
              </Typography>
            </Stack>

            <Transitions>
              {LTVError && (
                <Typography color={'error'} variant={'body3'}>
                  {LTVError}
                </Typography>
              )}
            </Transitions>
          </Stack>

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
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>Cash out amount</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      cashOutAmount: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={cashOutAmount || undefined}
                />
              </Stack>
            )}
          </Transitions>

          <Stack gap={1} width={'100%'}>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>
                  Estimated rehab loan amount
                </Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      cor: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={cor || undefined}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>
                  After repair value (ARV){' '}
                  <StyledTooltip
                    title={
                      'ARV (As-is property value + Estimated rehab loan amount)'
                    }
                  >
                    <InfoOutlined sx={{ width: 16, height: 16 }} />
                  </StyledTooltip>
                </Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
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
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              justifyContent={'flex-start'}
              width={{ md: 'calc(50% - 12px)', xs: '100%' }}
            >
              <Typography variant={'body1'}>Loan to cost</Typography>
              <StyledTooltip
                title={
                  'Loan to cost (LTC) – Total loan amount/(As is value + Rehab amount)'
                }
              >
                <InfoOutlined sx={{ width: 16, height: 16 }} />
              </StyledTooltip>
              <Typography ml={'auto'} variant={'body1'}>
                {POSFormatPercent(LTC)}
              </Typography>
            </Stack>
            <Transitions>
              {LTCError && (
                <Typography color={'error'} variant={'body3'}>
                  {LTCError}
                </Typography>
              )}
            </Transitions>
          </Stack>

          {renderByUserType}
        </StyledFormItem>

        <StyledButton
          disabled={!isValid || loading || loanStage === LoanStage.Approved}
          onClick={onCheck}
          sx={{ width: 200, mt: 3 }}
        >
          Check
        </StyledButton>
      </StyledFormItem>
    </>
  );
};
