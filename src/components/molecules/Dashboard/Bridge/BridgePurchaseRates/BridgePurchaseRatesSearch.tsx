import {
  StyledButton,
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';

import { OPTIONS_COMMON_USER_TYPE } from '@/constants';
import { BPQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSNotUndefined,
} from '@/utils';
import { InfoOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { addDays, compareDesc, isValid as dateValid, isDate } from 'date-fns';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';

interface BridgePurchaseRatesSearchProps {
  loading: boolean;
  onCheck: () => void;
  searchForm: BPQueryData;
  setSearchForm: Dispatch<SetStateAction<BPQueryData>>;
  userType?: UserType;
  loanStage?: LoanStage;
  isDashboard?: boolean;
}

export const BridgePurchaseRatesSearch: FC<BridgePurchaseRatesSearchProps> = ({
  onCheck,
  searchForm,
  setSearchForm,
  loading,
  userType,
  loanStage = LoanStage.Application,
  isDashboard = false,
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
    closeDate,
  } = searchForm;

  const [LTVError, setLTVError] = useState<string>('');

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
                  validate={pointsError}
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
                  validate={pointsError}
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
                  validate={pointsError}
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
        gap={4}
        label={
          isDashboard
            ? 'View other rates'
            : 'Estimate your stabilized bridge loan rate'
        }
        labelSx={{
          m: 0,
          marginBottom: `${isDashboard ? 0 : '24px'} !important`,
        }}
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
                Preferred close date
                <StyledTooltip
                  title={
                    '"Preferred close date" is the date on which you wish to complete a real estate transaction or loan application. We will stay in touch with you to ensure that the transaction is completed at the most suitable time.'
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
            sx={{ mb: 3 }}
            width={'100%'}
          >
            <StyledDatePicker
              disableFuture={false}
              disablePast
              label={'Preferred close date'}
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
          sx={{ mb: userType === UserType.CUSTOMER ? 0 : 3 }}
          width={'100%'}
          //mt={3}
        >
          <Stack gap={0.5} width={'100%'}>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextFieldNumber
                disabled={loading || loanStage === LoanStage.Approved}
                label={'Purchase price'}
                onValueChange={({ floatValue }) => {
                  setSearchForm({
                    ...searchForm,
                    purchasePrice: floatValue,
                  });
                }}
                prefix={'$'}
                value={purchasePrice}
              />

              <StyledTextFieldNumber
                disabled={loading || loanStage === LoanStage.Approved}
                label={'Purchase loan amount'}
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
            {POSFormatDollar(purchaseLoanAmount)}
          </Typography>
        </Stack>

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
