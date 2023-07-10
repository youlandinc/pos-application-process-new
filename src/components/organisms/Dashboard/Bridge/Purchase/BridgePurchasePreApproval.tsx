import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useAsyncEffect } from '@/hooks';
import { Address, IAddress } from '@/models/common/Address';
import { LoanStage, UserType } from '@/types/enum';
import {
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
        } = data;
        setRateData({
          isCor,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          brokerPoints,
          brokerProcessingFee,
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

  const brokerPointsError = useMemo(() => {
    const { brokerPoints } = rateData || {};

    if (!brokerPoints) {
      return undefined;
    }
    if (brokerPoints <= 5) {
      return undefined;
    }
    return ['Broker origination fee must be lesser than or equal to 5%.'];
  }, [rateData]);

  const brokerFeeError = useMemo(() => {
    const { brokerProcessingFee } = rateData || {};

    if (!POSNotUndefined(brokerProcessingFee) || !editLoanAmount) {
      return undefined;
    }
    if ((brokerProcessingFee as number) <= editLoanAmount) {
      return undefined;
    }
    return [
      `Broker origination fee must be lesser than or equal to ${POSFormatDollar(
        editLoanAmount,
      )}.`,
    ];
  }, [rateData, editLoanAmount]);

  const clickable = useMemo(() => {
    const brokerCondition =
      userType === UserType.BROKER
        ? POSNotUndefined(rateData?.brokerPoints) &&
          POSNotUndefined(rateData?.brokerProcessingFee) &&
          !brokerPointsError &&
          !brokerFeeError
        : true;

    if (
      !propertyType ||
      !address?.checkAddressValid ||
      !!LTVError ||
      !!LTCError ||
      !brokerCondition
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
    rateData?.brokerPoints,
    rateData?.brokerProcessingFee,
    rateData?.isCor,
    rateData?.cor,
    rateData?.arv,
    brokerPointsError,
    brokerFeeError,
    propertyType,
    address?.checkAddressValid,
    LTVError,
    LTCError,
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
    return (
      <>
        <Stack gap={3} width={'100%'}>
          <StyledTextFieldNumber
            disabled={checkLoading}
            error={!!LTVError}
            label="Purchase price"
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
            label="Purchase loan amount"
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
            label={'Rehab loan amount'}
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
                  label={'Estimated rehab loan amount'}
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
                  label={'After repair value (ARV)'}
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
        <Stack
          sx={{ display: userType === UserType.BROKER ? 'block' : 'none' }}
          width={'100%'}
        >
          <Transitions>
            {userType === UserType.BROKER && (
              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={checkLoading}
                  error={!!brokerPointsError || undefined}
                  label="Broker origination fee"
                  onValueChange={({ floatValue }) =>
                    setRateData({
                      ...(rateData as BridgePurchaseEstimateRateData),
                      brokerPoints: floatValue,
                    })
                  }
                  percentage
                  suffix={'%'}
                  thousandSeparator={false}
                  value={rateData?.brokerPoints}
                />
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  error={!!brokerFeeError || undefined}
                  label="Broker processing fee"
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...(rateData as BridgePurchaseEstimateRateData),
                      brokerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  value={rateData?.brokerProcessingFee}
                />
              </Stack>
            )}
          </Transitions>
        </Stack>
      </>
    );
  }, [
    LTVError,
    rateData,
    checkLoading,
    LTV,
    LTCError,
    LTC,
    userType,
    brokerPointsError,
    brokerFeeError,
  ]);

  const infoRef = useRef<HTMLInputElement>(null);

  return (
    <Box mx={{ lg: 'auto', xs: 0 }}>
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
    </Box>
  );
});
