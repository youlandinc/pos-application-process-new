import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, OPTIONS_COMMON_USER_TYPE } from '@/constants';
import { useAsyncEffect, useBreakpoints } from '@/hooks';
import { Address, IAddress } from '@/models/common/Address';
import { LoanStage, UserType } from '@/types/enum';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSNotUndefined,
} from '@/utils';
import {
  BridgePurchaseEstimateRateData,
  MPPreApprovalLetterBPData,
  PropertyOpt,
  PropertyUnitOpt,
  RatesProductData,
} from '@/types';
import {
  _fetchPreApprovedLetterCheck,
  _fetchPreApprovedLetterInfo,
  _updateRatesProductSelected,
  UpdateRatesPostData,
} from '@/requests/dashboard';

import {
  StyledButton,
  StyledCheckbox,
  StyledLoading,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';
import { PreApprovalEdit, PreApprovalInfo } from '@/components/molecules';

export const BridgePurchasePreApproval: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const [loanStage, setLoanStage] = useState<LoanStage | undefined>(
    LoanStage.PreApproved,
  );
  const [loanAmount, setLoanAmount] = useState<number>();
  const [tableStatus, setTableStatus] = useState<'edit' | 'view'>('view');
  const [propertyUnit, setPropertyUnit] = useState<PropertyUnitOpt>(
    PropertyUnitOpt.default,
  );
  const [propertyType, setPropertyType] = useState<PropertyOpt>(
    PropertyOpt.default,
  );
  const [address, setAddress] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );
  const [rateData, setRateData] = useState<BridgePurchaseEstimateRateData>();

  const [LTVError, setLTVError] = useState<undefined | string[]>(undefined);
  const [LTCError, setLTCError] = useState<undefined | string[]>(undefined);

  const [productData, setProductData] = useState<RatesProductData>();

  const [checkResult, setCheckResult] = useState<unknown>();
  const [checkLoading, setCheckLoading] = useState<boolean>(false);

  const LTV = useMemo(() => {
    if (!rateData?.purchaseLoanAmount || !rateData?.purchasePrice) {
      return 0;
    }
    setLTVError(
      rateData?.purchaseLoanAmount / rateData?.purchasePrice <= 0.75
        ? undefined
        : ['Your LTV should be no more than 75%'],
    );
    if (rateData?.purchaseLoanAmount < 150000) {
      setLTVError([
        'Adjust your down payment. Total loan amount must be at least $150,000',
      ]);
    }
    return rateData?.purchaseLoanAmount
      ? rateData?.purchaseLoanAmount / rateData?.purchasePrice
      : 0;
  }, [rateData?.purchaseLoanAmount, rateData?.purchasePrice]);

  const editLoanAmount = useMemo(() => {
    return rateData?.isCor
      ? (rateData?.purchaseLoanAmount as number) + (rateData?.cor as number)
      : rateData?.purchaseLoanAmount;
  }, [rateData?.purchaseLoanAmount, rateData?.cor, rateData?.isCor]);

  const LTC = useMemo(() => {
    if (!rateData?.isCor) {
      setLTCError(undefined);
      return 0;
    }
    const result =
      (editLoanAmount as number) /
      ((rateData?.cor as number) + (rateData?.purchasePrice as number));
    setLTCError(
      result > 0.75
        ? [
            'Reduce your purchase loan amount or rehab loan amount. Your Loan-to-Cost should be no more than 75%',
          ]
        : undefined,
    );
    return result;
  }, [editLoanAmount, rateData?.cor, rateData?.isCor, rateData?.purchasePrice]);

  const [initState, getInitData] = useAsyncFn(async (processId: string) => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchPreApprovedLetterInfo<MPPreApprovalLetterBPData>(
      processId,
    )
      .then((res) => {
        const { data } = res;
        setLoanStage(data?.loanStage);
        setLoanAmount(data.loanAmount);
        setPropertyType(data.propertyType);
        setPropertyUnit(data.propertyUnit);
        setAddress(
          Address.create({
            formatAddress: data.propAddr.address,
            state: data.propAddr?.state ?? '',
            street: '',
            city: data.propAddr?.city ?? '',
            aptNumber: data.propAddr?.aptNumber ?? '',
            postcode: data.propAddr?.postcode ?? '',
            isValid: false,
            errors: {},
          }),
        );
        const {
          isCor,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          brokerPoints,
          brokerProcessingFee,
          lenderPoints,
          lenderProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        } = data;
        setRateData({
          isCor,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          brokerPoints,
          brokerProcessingFee,
          lenderPoints,
          lenderProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        });
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () => router.push('/pipeline'),
        }),
      );
  }, []);

  useAsyncEffect(async () => {
    await getInitData(router.query.processId as string);
  }, [router.query.processId]);

  const onChangeTableStatus = useCallback(() => {
    setTableStatus(tableStatus === 'edit' ? 'view' : 'edit');
    setCheckResult(undefined);
  }, [tableStatus]);

  const onClickCheck = useCallback(async () => {
    setCheckLoading(true);
    setCheckResult(true);
    setProductData(undefined);
    const postData = {
      propAddr: address?.getPostData(),
      propertyUnit,
      propertyType,
      ...rateData,
    };
    const { data, status } =
      await _fetchPreApprovedLetterCheck<MPPreApprovalLetterBPData>(
        router.query.processId as string,
        postData as MPPreApprovalLetterBPData,
      );
    if (status === 200) {
      setCheckResult(!!data);
      setProductData(data);
    }
    setCheckLoading(false);
  }, [address, router.query.processId, propertyType, propertyUnit, rateData]);

  const onClickUpdate = useCallback(async () => {
    const addressData = address?.getPostData();
    const postData = {
      id: productData?.id,
      queryParams: {
        propAddr: addressData,
        propertyType,
        propertyUnit,
        ...rateData,
      },
    };
    const res = await _updateRatesProductSelected(
      router.query.processId as string,
      postData as UpdateRatesPostData,
    );
    if (res.status === 200) {
      setCheckResult(undefined);
      setTableStatus('view');
      await getInitData(router.query.processId as string);
      enqueueSnackbar('Update Successfully!' as string, {
        variant: 'success',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  }, [
    address,
    enqueueSnackbar,
    getInitData,
    router.query.processId,
    productData?.id,
    propertyType,
    propertyUnit,
    rateData,
  ]);

  const pointsError = useMemo(() => {
    const { brokerPoints, lenderPoints, officerPoints } = rateData || {};

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
      case UserType.CUSTOMER:
        return undefined;
      default:
        points = officerPoints;
        break;
    }

    if (!points) {
      return [''];
    }
    if (points <= 5) {
      return undefined;
    }
    return [
      `${POSFindLabel(
        OPTIONS_COMMON_USER_TYPE,
        userType as string as UserType,
      )} origination fee must be lesser than or equal to 5%.`,
    ];
  }, [rateData, userType]);

  const processingFeeError = useMemo(() => {
    const { brokerProcessingFee, lenderProcessingFee, officerProcessingFee } =
      rateData || {};

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
      case UserType.CUSTOMER:
        return undefined;
      default:
        fee = officerProcessingFee;
        break;
    }

    if (!POSNotUndefined(fee) || !loanAmount) {
      return [''];
    }
    if ((fee as number) <= loanAmount) {
      return undefined;
    }
    return [
      `${POSFindLabel(
        OPTIONS_COMMON_USER_TYPE,
        userType as string as UserType,
      )} origination fee must be lesser than or equal to ${POSFormatDollar(
        editLoanAmount,
      )}.`,
    ];
  }, [rateData, userType, loanAmount, editLoanAmount]);

  const agentFeeError = useMemo(() => {
    const { agentFee } = rateData || {};
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
  }, [loanAmount, rateData]);

  const clickable = useMemo(() => {
    let userCondition;
    switch (userType) {
      case UserType.BROKER:
        userCondition =
          POSNotUndefined(rateData?.brokerPoints) &&
          POSNotUndefined(rateData?.brokerProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.LENDER:
        userCondition =
          POSNotUndefined(rateData?.lenderPoints) &&
          POSNotUndefined(rateData?.lenderProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.LOAN_OFFICER:
        userCondition =
          POSNotUndefined(rateData?.officerPoints) &&
          POSNotUndefined(rateData?.officerProcessingFee) &&
          !pointsError &&
          !processingFeeError;
        break;
      case UserType.REAL_ESTATE_AGENT:
        userCondition = POSNotUndefined(rateData?.agentFee) && !agentFeeError;
        break;
      case UserType.CUSTOMER:
        userCondition = true;
        break;
      default:
        userCondition = true;
        break;
    }
    if (
      !address?.checkAddressValid ||
      !propertyType ||
      !!LTVError ||
      !!LTCError ||
      !userCondition
    ) {
      return false;
    }
    if (propertyType === PropertyOpt.twoToFourFamily) {
      return !!propertyUnit;
    }
    if (rateData?.isCor) {
      return !!(rateData.cor && rateData.arv);
    }
    return true;
  }, [
    userType,
    address?.checkAddressValid,
    propertyType,
    LTVError,
    LTCError,
    rateData?.isCor,
    rateData?.brokerPoints,
    rateData?.brokerProcessingFee,
    rateData?.lenderPoints,
    rateData?.lenderProcessingFee,
    rateData?.officerPoints,
    rateData?.officerProcessingFee,
    rateData?.agentFee,
    rateData?.cor,
    rateData?.arv,
    pointsError,
    processingFeeError,
    agentFeeError,
    propertyUnit,
  ]);

  const renderResultList = useMemo(() => {
    return typeof checkResult !== 'undefined' ? (
      <Box
        bgcolor={'#F5F8FA'}
        borderRadius={2}
        color={'#3F51B5'}
        fontSize={16}
        fontWeight={400}
        lineHeight={1.5}
        maxWidth={{ xs: '100%', md: 600, xl: '100%' }}
        mt={3}
        p={3}
        width={'100%'}
      >
        {checkLoading ? (
          <StyledLoading
            sx={{ justifyContent: 'flex-start', color: 'primary.main' }}
          />
        ) : checkResult ? (
          <Stack
            alignItems={'center'}
            flexDirection={{ xl: 'row', xs: 'column' }}
            justifyContent={'space-between'}
          >
            <Stack gap={1}>
              <Box fontWeight={700}>Your updated loan product</Box>
              <Box>
                Based on that new info, here&apos;s an updated rate and loan you
                might like
              </Box>
              <Box fontWeight={700}>
                {POSFormatLocalPercent(productData?.interestRateOfYear)} Rate /{' '}
                {productData?.loanTerm} months /{' '}
                {POSFormatDollar(productData?.paymentOfMonth)} Monthly payment
              </Box>
            </Stack>
            <Box>
              <StyledButton
                color={'primary'}
                disabled={!clickable}
                onClick={onClickUpdate}
                sx={{ width: 200, mt: { xl: 0, xs: 1 } }}
                variant={'contained'}
              >
                Update
              </StyledButton>
            </Box>
          </Stack>
        ) : (
          <Box>
            Based on your information, we couldn&apos;t find any rate options.
            Please try again.
          </Box>
        )}
      </Box>
    ) : null;
  }, [
    clickable,
    checkLoading,
    checkResult,
    onClickUpdate,
    productData?.interestRateOfYear,
    productData?.loanTerm,
    productData?.paymentOfMonth,
  ]);

  const renderEditChildren = useMemo(() => {
    let additionalCondition;
    switch (userType) {
      case UserType.BROKER:
        additionalCondition = (
          <>
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={checkLoading}
              label="Broker Origination Fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  brokerPoints: floatValue,
                })
              }
              percentage
              suffix={'%'}
              thousandSeparator={false}
              validate={pointsError}
              value={rateData?.brokerPoints}
            />
            <StyledTextFieldNumber
              disabled={checkLoading}
              label="Broker Processing Fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  brokerProcessingFee: floatValue,
                });
              }}
              prefix={'$'}
              validate={processingFeeError}
              value={rateData?.brokerProcessingFee}
            />
          </>
        );
        break;
      case UserType.LENDER:
        additionalCondition = (
          <>
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={checkLoading}
              label="Lender Origination Fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  lenderPoints: floatValue,
                })
              }
              percentage
              suffix={'%'}
              thousandSeparator={false}
              validate={pointsError}
              value={rateData?.lenderPoints}
            />
            <StyledTextFieldNumber
              disabled={checkLoading}
              label="Lender Processing Fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  lenderProcessingFee: floatValue,
                });
              }}
              prefix={'$'}
              validate={processingFeeError}
              value={rateData?.lenderProcessingFee}
            />
          </>
        );
        break;
      case UserType.LOAN_OFFICER:
        additionalCondition = (
          <>
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={checkLoading}
              label="Loan Officer Origination Fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  officerPoints: floatValue,
                })
              }
              percentage
              suffix={'%'}
              thousandSeparator={false}
              validate={pointsError}
              value={rateData?.officerPoints}
            />
            <StyledTextFieldNumber
              disabled={checkLoading}
              label="Loan Officer Processing Fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  officerProcessingFee: floatValue,
                });
              }}
              prefix={'$'}
              validate={processingFeeError}
              value={rateData?.officerProcessingFee}
            />
          </>
        );
        break;
      case UserType.REAL_ESTATE_AGENT:
        additionalCondition = (
          <>
            <StyledTextFieldNumber
              disabled={checkLoading}
              label="Real Estate Agent Processing Fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
                  agentFee: floatValue,
                });
              }}
              prefix={'$'}
              validate={agentFeeError}
              value={rateData?.agentFee}
            />
          </>
        );
        break;
    }

    return (
      <>
        <Stack gap={3} width={'100%'}>
          <StyledTextFieldNumber
            disabled={checkLoading}
            error={!!LTVError}
            label="Purchase Price"
            onValueChange={({ floatValue }) =>
              setRateData({
                ...(rateData as BridgePurchaseEstimateRateData),
                purchasePrice: floatValue,
              })
            }
            prefix={'$'}
            value={rateData?.purchasePrice}
          />
          <StyledTextFieldNumber
            disabled={checkLoading}
            error={!!LTVError}
            label="Purchase Loan Amount"
            onValueChange={({ floatValue }) => {
              setRateData({
                ...(rateData as BridgePurchaseEstimateRateData),
                purchaseLoanAmount: floatValue,
              });
            }}
            prefix={'$'}
            value={rateData?.purchaseLoanAmount}
          />
          <StyledTextFieldNumber
            decimalScale={3}
            disabled
            label="Loan-to-Value"
            onValueChange={() => undefined}
            percentage
            suffix={'%'}
            thousandSeparator={false}
            value={POSFormatLocalPercent(LTV)}
          />
        </Stack>
        <Stack sx={{ display: LTVError ? 'block' : 'none' }} width={'100%'}>
          <Transitions>
            {LTVError && (
              <Stack color={'error.main'} width={'100%'}>
                {LTVError}
              </Stack>
            )}
          </Transitions>
        </Stack>

        <Stack width={'100%'}>
          <StyledCheckbox
            checked={rateData?.isCor}
            disabled={checkLoading}
            label={'Rehab Loan Amount'}
            onChange={(e) => {
              setRateData({
                ...(rateData as BridgePurchaseEstimateRateData),
                isCor: e.target.checked,
              });
            }}
          />
        </Stack>
        <Stack
          sx={{ display: rateData?.isCor ? 'block' : 'none' }}
          width={'100%'}
        >
          <Transitions>
            {rateData?.isCor && (
              <Stack gap={3} width={'100%'}>
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  error={!!LTCError}
                  label={'Estimated Rehab Loan Amount'}
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...rateData,
                      cor: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={rateData?.cor || undefined}
                />
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  error={!!LTCError}
                  label={'After Repair Value (ARV)'}
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...rateData,
                      arv: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={rateData?.arv || undefined}
                />
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled
                  label={'Loan-to-Cost'}
                  onValueChange={() => undefined}
                  percentage={true}
                  suffix={'%'}
                  thousandSeparator={false}
                  value={POSFormatLocalPercent(LTC)}
                />
              </Stack>
            )}
          </Transitions>
        </Stack>
        <Stack sx={{ display: LTCError ? 'block' : 'none' }} width={'100%'}>
          <Transitions>
            {LTCError && (
              <Stack color={'error.main'} width={'100%'}>
                {LTCError}
              </Stack>
            )}
          </Transitions>
        </Stack>

        <Transitions
          style={{
            display: userType !== UserType.CUSTOMER ? 'block' : 'none',
            width: '100%',
          }}
        >
          <Stack gap={3} width={'100%'}>
            {additionalCondition}
          </Stack>
        </Transitions>
      </>
    );
  }, [
    userType,
    checkLoading,
    LTVError,
    rateData,
    LTV,
    LTCError,
    LTC,
    pointsError,
    processingFeeError,
    agentFeeError,
  ]);

  const infoRef = useRef<HTMLInputElement>(null);

  return (
    <Transitions
      style={{
        margin: ['xs', 'sm', 'md'].includes(breakpoints) ? 0 : '0 auto',
      }}
    >
      {tableStatus === 'view' ? (
        <PreApprovalInfo
          loading={initState.loading}
          loanAmount={loanAmount}
          loanStage={loanStage}
          onClickEdit={onChangeTableStatus}
          processId={router.query.processId as string}
          ref={infoRef}
        />
      ) : (
        <>
          <PreApprovalEdit
            address={address}
            clickable={!clickable}
            editable={checkLoading}
            onClickCancel={onChangeTableStatus}
            onClickCheck={onClickCheck}
            onTypeChange={setPropertyType}
            onUnitChange={setPropertyUnit}
            propertyType={propertyType}
            propertyUnit={propertyUnit}
            resultList={renderResultList}
          >
            {renderEditChildren}
          </PreApprovalEdit>
        </>
      )}
    </Transitions>
  );
});
