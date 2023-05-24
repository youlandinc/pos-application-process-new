import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { BRQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import {
  StyledButton,
  StyledCheckbox,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';

import { POSFormatDollar, POSFormatPercent, POSNotUndefined } from '@/utils';

interface BridgeRefinanceRatesSearchProps {
  onCheck: () => void;
  searchForm: BRQueryData;
  setSearchForm: Dispatch<SetStateAction<BRQueryData>>;
  loading: boolean;
  userType: UserType;
  loanStage?: LoanStage;
}

export const BridgeRefinanceRatesSearch: FC<BridgeRefinanceRatesSearchProps> = (
  props,
) => {
  const {
    onCheck,
    searchForm,
    setSearchForm,
    loading,
    userType,
    loanStage = LoanStage.Application,
  } = props;

  const {
    cor,
    isCor,
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
  } = searchForm;

  const [LTVError, setLTVError] = useState<string>('');
  const [LTCError, setLTCError] = useState<string>('');

  const loanAmount = useMemo(() => {
    let total = balance;
    if (isCor) {
      total! += cor || 0;
    }
    if (isCashOut) {
      total! += cashOutAmount || 0;
    }
    return total;
  }, [balance, cashOutAmount, cor, isCashOut, isCor]);

  const LTV = useMemo(() => {
    let radio = 0.7;
    if (!homeValue) {
      return 0;
    }
    if (isCor) {
      setLTVError('');
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
    if (loanAmount! < 150000) {
      setLTVError('Total loan amount must be at least $150,000');
    }
    return total / homeValue;
  }, [homeValue, balance, isCor, isCashOut, loanAmount, cashOutAmount]);

  const LTC = useMemo(() => {
    const result = cor === 0 ? 0 : loanAmount! / (cor! + homeValue!);
    setLTCError(
      !isCor
        ? ''
        : result > 0.75
        ? 'Reduce your loan amount or rehab cost. Your Loan-to-Cost should be no more than 75%'
        : '',
    );
    return result;
  }, [cor, homeValue, isCor, loanAmount]);

  const pointsError = useMemo(() => {
    const points = userType === UserType.BROKER ? brokerPoints : officerPoints;
    if (!POSNotUndefined(points)) {
      return [''];
    }
    if (points! <= 5) {
      return undefined;
    }
    return [
      `${
        userType === UserType.BROKER ? 'Broker' : 'Loan officer'
      } origination fee must be lesser than or equal to 5%.`,
    ];
  }, [brokerPoints, officerPoints, userType]);

  const processingFeeError = useMemo(() => {
    const fee =
      userType === UserType.BROKER ? brokerProcessingFee : officerProcessingFee;
    if (!POSNotUndefined(fee) || !loanAmount) {
      return [''];
    }
    if (fee! <= loanAmount) {
      return undefined;
    }
    return [
      `${
        userType === UserType.BROKER ? 'Broker' : 'Loan officer'
      } origination fee must be lesser than or equal to ${POSFormatDollar(
        loanAmount,
      )}.`,
    ];
  }, [brokerProcessingFee, loanAmount, officerProcessingFee, userType]);

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
    if (!isCor && !isCashOut) {
      return homeValue && POSNotUndefined(balance) && flag;
    } else if (isCor || isCashOut) {
      if (isCor && isCashOut) {
        return (
          homeValue &&
          POSNotUndefined(balance) &&
          cashOutAmount &&
          cor &&
          arv &&
          flag
        );
      } else if (isCashOut) {
        return homeValue && cashOutAmount && flag;
      } else if (isCor) {
        return homeValue && cor && arv && flag;
      }
    }
    return true;
  }, [
    userType,
    LTVError,
    LTCError,
    isCor,
    isCashOut,
    agentFee,
    agentFeeError,
    officerPoints,
    officerProcessingFee,
    pointsError,
    processingFeeError,
    brokerPoints,
    brokerProcessingFee,
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
            label={'Broker Origination Compensation'}
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
                <Typography>Broker Origination Fee</Typography>
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
                <Typography>Broker Processing Fee</Typography>
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
      case UserType.LOAN_OFFICER:
        return (
          <StyledFormItem
            gap={3}
            label={'Loan Officer Origination Compensation'}
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
                <Typography>Loan Officer Origination Compensation</Typography>
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
                <Typography>Loan Officer Processing Fee</Typography>
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
            label={'Real Estate Agent Origination Compensation'}
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
                <Typography>Loan Officer Origination Compensation</Typography>
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
        label={'Estimate your bridge loan rate'}
        labelSx={{ m: 0 }}
      >
        <StyledFormItem
          alignItems={'flex-start'}
          gap={3}
          label={`Total Loan Amount: ${POSFormatDollar(loanAmount)}`}
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
                <Typography variant={'body1'}>Estimated Home Value</Typography>
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
                <Typography variant={'body1'}>
                  Remaining Loan Balance
                </Typography>
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
              <Typography variant={'body1'}>Loan to Value</Typography>
              <StyledTooltip
                title={
                  'LTV [Remaining Balance + Cash Out (if any)] / Home Value'
                }
              >
                <InfoOutlined sx={{ width: 16, height: 16 }} />
              </StyledTooltip>
              <Typography ml={'auto'} variant={'body1'}>
                {POSFormatPercent(LTV)}
              </Typography>
            </Stack>

            <Transitions>
              {LTVError && !isCor && (
                <Typography color={'error'} variant={'body3'}>
                  {LTVError}
                </Typography>
              )}
            </Transitions>
          </Stack>

          <StyledCheckbox
            checked={isCashOut}
            disabled={loading || loanStage === LoanStage.Approved}
            label={'Cash Out Amount'}
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
                <Typography variant={'body1'}>Cash Out Amount</Typography>
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

          <StyledCheckbox
            checked={isCor}
            disabled={loading || loanStage === LoanStage.Approved}
            label={'Rehab Loan Amount'}
            onChange={(e) => {
              setSearchForm({
                ...searchForm,
                isCor: e.target.checked,
              });
            }}
          />

          <Transitions
            style={{
              width: '100%',
              display: isCashOut ? 'block' : 'none',
            }}
          >
            {isCor && (
              <Stack gap={1} width={'100%'}>
                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <Stack flex={1} gap={1}>
                    <Typography variant={'body1'}>
                      Estimated Rehab Loan Amount
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
                      After Repair Value (ARV){' '}
                      <StyledTooltip
                        title={
                          'ARV (Estimated Home Value + Estimated Rehab Loan Amount)'
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
                  <Typography variant={'body1'}>Loan to Cost</Typography>
                  <StyledTooltip
                    title={'ARV (Purchase price + Estimated rehab loan amount)'}
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
            )}
          </Transitions>

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
