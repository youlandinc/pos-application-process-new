import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { addDays, compareDesc, isValid as dateValid, isDate } from 'date-fns';

import { GPQueryData } from '@/requests/dashboard';
import { LoanStage, UserType } from '@/types/enum';
import { POSFormatDollar, POSFormatPercent } from '@/utils';

import {
  StyledDatePicker,
  StyledFormItem,
  StyledTextFieldNumber,
  StyledTooltip,
} from '@/components/atoms';

interface GroundPurchaseRatesSearchProps {
  loading: boolean;
  searchForm: GPQueryData;
  setSearchForm: Dispatch<SetStateAction<GPQueryData>>;
  debounceSet: Dispatch<SetStateAction<GPQueryData>>;
  userType?: UserType;
  loanStage?: LoanStage;
  isDashboard?: boolean;
  id?: string;
}

export const GroundPurchaseRatesSearch: FC<GroundPurchaseRatesSearchProps> = ({
  searchForm,
  userType,
  //setSearchForm,
  //loading,
  //loanStage = LoanStage.Application,
  isDashboard = false,
  id,
  debounceSet,
}) => {
  const {
    purchasePrice,
    cor,
    arv,
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
    return (purchaseLoanAmount as number) + (cor || 0);
  }, [purchaseLoanAmount, cor]);

  const LTV = useMemo(() => {
    if (!purchaseLoanAmount || !purchasePrice) {
      return 0;
    }
    return purchaseLoanAmount ? purchaseLoanAmount / purchasePrice : 0;
  }, [purchaseLoanAmount, purchasePrice]);

  const LTC = useMemo(() => {
    return (
      (loanAmount as number) / ((cor as number) + (purchasePrice as number))
    );
  }, [loanAmount, cor, purchasePrice]);

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
                    debounceSet({
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
                    debounceSet({
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
                    debounceSet({
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
                    debounceSet({
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
                    debounceSet({
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
                    debounceSet({
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
                    debounceSet({
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
    debounceSet,
    userType,
  ]);

  return (
    <StyledFormItem
      gap={4}
      id={id}
      label={
        isDashboard
          ? 'View other rates'
          : 'Estimate your ground-up construction loan rate'
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
          sx={{ mb: 3 }}
          width={'100%'}
        >
          <StyledDatePicker
            disableFuture={false}
            disablePast
            label={'Preferred closing date'}
            onChange={(value) => {
              debounceSet({
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
      >
        <Stack gap={0.5} width={'100%'}>
          <Stack
            flexDirection={{ lg: 'row', xs: 'column' }}
            gap={3}
            width={'100%'}
          >
            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'Purchase price'}
              onValueChange={({ floatValue }) => {
                debounceSet({
                  ...searchForm,
                  purchasePrice: floatValue,
                });
              }}
              prefix={'$'}
              value={purchasePrice}
            />

            <StyledTextFieldNumber
              //disabled={loading || loanStage === LoanStage.Approved}
              label={'Purchase loan amount'}
              onValueChange={({ floatValue }) => {
                debounceSet({
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
              title={'LTV = Purchase loan amount / Purchase price'}
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
                debounceSet({
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
                debounceSet({
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
                'LTC = Total loan amount / (Purchase price + Rehab loan amount)'
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
