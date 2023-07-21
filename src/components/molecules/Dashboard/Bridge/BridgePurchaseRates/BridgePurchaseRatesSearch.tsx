import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import { OPTIONS_COMMON_USER_TYPE } from '@/constants';
import { LoanStage, UserType } from '@/types/enum';
import { BPQueryData } from '@/requests/dashboard';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSNotUndefined,
} from '@/utils';

import {
  StyledButton,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';

interface BridgePurchaseRatesSearchProps {
  loading: boolean;
  onCheck: () => void;
  searchForm: BPQueryData;
  setSearchForm: Dispatch<SetStateAction<BPQueryData>>;
  userType?: UserType;
  loanStage?: LoanStage;
}

export const BridgePurchaseRatesSearch: FC<BridgePurchaseRatesSearchProps> = ({
  onCheck,
  searchForm,
  setSearchForm,
  loading,
  userType,
  loanStage = LoanStage.Application,
}) => {
  const {
    purchasePrice,
    purchaseLoanAmount,
    brokerPoints,
    brokerProcessingFee,
    officerPoints,
    officerProcessingFee,
    agentFee,
    lenderPoints,
    lenderProcessingFee,
  } = searchForm;

  const [LTVError, setLTVError] = useState<string>('');

  const LTV = useMemo(() => {
    if (!purchaseLoanAmount || !purchasePrice) {
      setLTVError('');
      return 0;
    }
    setLTVError(
      purchaseLoanAmount / purchasePrice <= 0.8
        ? ''
        : 'Your LTV should be no more than 80%',
    );
    if (purchaseLoanAmount < 100000) {
      setLTVError(
        'Adjust your down payment. Total loan amount must be at least $100,000',
      );
    }
    return purchaseLoanAmount ? purchaseLoanAmount / purchasePrice : 0;
  }, [purchaseLoanAmount, purchasePrice]);

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
    if ((points as number) <= 5) {
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

    if (!POSNotUndefined(fee) || !purchaseLoanAmount) {
      return [''];
    }
    if ((fee as number) <= purchaseLoanAmount) {
      return undefined;
    }
    return [
      `${POSFindLabel(
        OPTIONS_COMMON_USER_TYPE,
        userType as string as UserType,
      )} origination fee must be lesser than or equal to ${POSFormatDollar(
        purchaseLoanAmount,
      )}.`,
    ];
  }, [
    brokerProcessingFee,
    purchaseLoanAmount,
    officerProcessingFee,
    lenderProcessingFee,
    userType,
  ]);

  const agentFeeError = useMemo(() => {
    if (!POSNotUndefined(agentFee) || !purchaseLoanAmount) {
      return [''];
    }
    if ((agentFee as number) <= purchaseLoanAmount) {
      return undefined;
    }
    return [
      `Real estate agent fee must be lesser than or equal to ${POSFormatDollar(
        purchaseLoanAmount,
      )}.`,
    ];
  }, [agentFee, purchaseLoanAmount]);

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

    if (LTVError) {
      return false;
    }
    return purchasePrice && purchaseLoanAmount && flag;
  }, [
    userType,
    LTVError,
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
    lenderPoints,
    lenderProcessingFee,
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
      case UserType.LENDER:
        return (
          <StyledFormItem
            gap={3}
            label={'Lender Origination Compensation'}
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
                <Typography>Lender Origination Fee</Typography>
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
                <Typography>Lender Processing Fee</Typography>
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
                <Typography>
                  Real Estate Agent Origination Compensation
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
        label={'Estimate your bridge loan rate'}
        labelSx={{ m: 0 }}
      >
        <StyledFormItem
          alignItems={'flex-start'}
          gap={3}
          label={`Total Loan Amount: ${POSFormatDollar(purchaseLoanAmount)}`}
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
              width={{ md: 'calc(50% - 12px)', xs: '100%' }}
            >
              <Typography variant={'body1'}>Loan to Value</Typography>
              <StyledTooltip
                title={'LTV (Purchase Loan Amount to Purchase Price)'}
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
        </StyledFormItem>

        {renderByUserType}

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
