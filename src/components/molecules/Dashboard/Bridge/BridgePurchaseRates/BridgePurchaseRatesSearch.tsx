import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { BPQueryData } from '@/requests/dashboard';
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

interface BridgePurchaseRatesSearchProps {
  loading: boolean;
  onCheck: () => void;
  searchForm: BPQueryData;
  setSearchForm: Dispatch<SetStateAction<BPQueryData>>;
  userType?: UserType;
  loanStage?: LoanStage;
}

export const BridgePurchaseRatesSearch: FC<BridgePurchaseRatesSearchProps> = (
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
    isCor,
    purchasePrice,
    cor,
    arv,
    purchaseLoanAmount,
    brokerPoints,
    brokerProcessingFee,
    officerPoints,
    officerProcessingFee,
    agentFee,
  } = searchForm;

  const [LTVError, setLTVError] = useState<string>('');
  const [LTCError, setLTCError] = useState<string>('');

  const loanAmount = useMemo(() => {
    return isCor
      ? (purchaseLoanAmount as number) + (cor as number)
      : purchaseLoanAmount;
  }, [purchaseLoanAmount, cor, isCor]);

  const LTV = useMemo(() => {
    if (!purchaseLoanAmount || !purchasePrice) {
      setLTVError('');
      return 0;
    }
    setLTVError(
      purchaseLoanAmount / purchasePrice <= 0.75
        ? ''
        : 'Your LTV should be no more than 75%',
    );
    if (purchaseLoanAmount < 150000) {
      setLTVError(
        'Adjust your down payment. Total loan amount must be at least $150,000',
      );
    }
    return purchaseLoanAmount ? purchaseLoanAmount / purchasePrice : 0;
  }, [purchaseLoanAmount, purchasePrice]);

  const LTC = useMemo(() => {
    if (!isCor) {
      setLTCError('');
      return;
    }
    const result =
      (loanAmount as number) / ((cor as number) + (purchasePrice as number));
    setLTCError(
      result > 0.75
        ? 'Reduce your purchase loan amount or rehab loan amount. Your Loan-to-Cost should be no more than 75%'
        : '',
    );
    return result;
  }, [isCor, loanAmount, cor, purchasePrice]);

  const pointsError = useMemo(() => {
    const points = userType === UserType.BROKER ? brokerPoints : officerPoints;
    if (!POSNotUndefined(points)) {
      return [''];
    }
    if ((points as number) <= 5) {
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
    if ((fee as number) <= loanAmount) {
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
    if ((agentFee as number) <= loanAmount) {
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
    return isCor
      ? cor && arv && purchasePrice && purchaseLoanAmount && flag
      : purchasePrice && purchaseLoanAmount && flag;
  }, [
    userType,
    LTVError,
    LTCError,
    isCor,
    cor,
    arv,
    purchasePrice,
    purchaseLoanAmount,
    agentFee,
    agentFeeError,
    officerPoints,
    officerProcessingFee,
    pointsError,
    processingFeeError,
    brokerPoints,
    brokerProcessingFee,
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
              maxWidth={600}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Broker Origination Fee</Typography>
                <StyledTextFieldNumber
                  decimalScale={3}
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
            label={'Broker origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={600}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Loan Officer Origination Compensation</Typography>
                <StyledTextFieldNumber
                  decimalScale={3}
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
            label={'Broker origination compensation'}
            labelSx={{ m: 0 }}
            sub
          >
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              maxWidth={600}
              width={'100%'}
            >
              <Stack flex={1} gap={1}>
                <Typography>Loan Officer Origination Compensation</Typography>
                <StyledTextFieldNumber
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      agentFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={agentFee}
                  validate={agentFeeError}
                />
              </Stack>
            </Stack>
          </StyledFormItem>
        );
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
          maxWidth={600}
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
                <Typography variant={'body1'}>Purchase Price</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      purchasePrice: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={purchasePrice}
                />
              </Stack>
              <Stack flex={1} gap={1}>
                <Typography variant={'body1'}>Purchase Loan Amount</Typography>
                <StyledTextFieldNumber
                  disabled={loading || loanStage === LoanStage.Approved}
                  onValueChange={({ floatValue }) => {
                    setSearchForm({
                      ...searchForm,
                      purchaseLoanAmount: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={purchaseLoanAmount}
                />
              </Stack>
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1}
              justifyContent={'flex-start'}
              width={'calc(50% - 12px)'}
            >
              <Typography variant={'body1'}>Loan to Value</Typography>
              <StyledTooltip
                title={'LTV (purchase loan amount to purchase price)'}
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
            }}
          >
            {isCor && (
              <Stack gap={1} maxWidth={600} width={'100%'}>
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
                          'ARV (Purchase price + Estimated rehab loan amount)'
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
                  width={'calc(50% - 12px)'}
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
        </StyledFormItem>

        {renderByUserType}

        <StyledButton
          disabled={!isValid || loading || loanStage === LoanStage.Approved}
          onClick={onCheck}
          sx={{ width: 200 }}
        >
          Check
        </StyledButton>
      </StyledFormItem>
    </>
  );
};
