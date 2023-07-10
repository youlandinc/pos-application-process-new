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
  BridgeRefinanceEstimateRateData,
  MPPreApprovalLetterBRData,
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

export const BridgeRefinancePreApproval: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // const { open, visible, close } = useSwitch(false);

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
  const [rateData, setRateData] = useState<BridgeRefinanceEstimateRateData>();

  const [LTVError, setLTVError] = useState<undefined | string[]>(undefined);
  const [LTCError, setLTCError] = useState<undefined | string[]>(undefined);

  const [productData, setProductData] = useState<RatesProductData>();

  const [checkResult, setCheckResult] = useState<unknown>();
  const [checkLoading, setCheckLoading] = useState<boolean>(false);

  const editLoanAmount = useMemo(() => {
    let total = rateData?.balance || 0;
    if (rateData?.isCor) {
      total += rateData?.cor || 0;
    }
    if (rateData?.isCashOut) {
      total += rateData?.cashOutAmount || 0;
    }
    return total;
  }, [
    rateData?.balance,
    rateData?.isCor,
    rateData?.isCashOut,
    rateData?.cor,
    rateData?.cashOutAmount,
  ]);

  const LTV = useMemo(() => {
    let radio = 0.7;
    if (!rateData?.homeValue) {
      return 0;
    }
    let total = rateData?.balance || 0;
    if (rateData?.isCashOut) {
      total += rateData?.cashOutAmount || 0;
      radio = 0.7;
    } else {
      radio = 0.65;
    }
    setLTVError(
      total / rateData?.homeValue <= radio
        ? undefined
        : [`Your LTV should be no more than ${radio * 100}%`],
    );
    if (editLoanAmount < 150000) {
      setLTVError(['Total loan amount must be at least $150,000']);
    }
    return total / rateData?.homeValue;
  }, [
    editLoanAmount,
    rateData?.balance,
    rateData?.cashOutAmount,
    rateData?.homeValue,
    rateData?.isCashOut,
  ]);

  const LTC = useMemo(() => {
    const result =
      rateData?.cor === 0
        ? 0
        : (loanAmount as number) /
          ((rateData?.cor as number) + (rateData?.homeValue as number));
    setLTCError(
      !rateData?.isCor
        ? undefined
        : result > 0.75
        ? [
            'Reduce your cash out amount or rehab cost. Your Loan-to-Cost should be no more than 75%',
          ]
        : undefined,
    );
    return result;
  }, [loanAmount, rateData?.cor, rateData?.homeValue, rateData?.isCor]);

  const [initState, getInitData] = useAsyncFn(async (processId: string) => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchPreApprovedLetterInfo<MPPreApprovalLetterBRData>(
      processId,
    )
      .then((res) => {
        const { data } = res;
        setLoanStage(data?.loanStage);
        setLoanAmount(data.loanAmount);
        setPropertyType(data?.propertyType);
        setPropertyUnit(data.propertyUnit);
        setAddress(
          Address.create({
            formatAddress: data?.propAddr?.address,
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
          cor,
          isCor,
          isCashOut,
          cashOutAmount,
          balance,
          homeValue,
          arv,
          brokerPoints,
          brokerProcessingFee,
        } = data;
        setRateData({
          cor,
          isCor,
          isCashOut,
          cashOutAmount,
          balance,
          homeValue,
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
    const { data, status } = await _fetchPreApprovedLetterCheck(
      router.query.processId as string,
      postData as MPPreApprovalLetterBRData,
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
    }
  }, [
    address,
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
      return [''];
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
    if (rateData?.isCashOut) {
      return !!rateData.cashOutAmount;
    }
    return true;
  }, [
    userType,
    rateData?.brokerPoints,
    rateData?.brokerProcessingFee,
    rateData?.isCor,
    rateData?.isCashOut,
    rateData?.cor,
    rateData?.arv,
    rateData?.cashOutAmount,
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

            <Box sx={{ textAlign: 'center' }}>
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
            label="As-is Property Value"
            onValueChange={({ floatValue }) =>
              setRateData({
                ...(rateData as BridgeRefinanceEstimateRateData),
                homeValue: floatValue,
              })
            }
            prefix={'$'}
            value={rateData?.homeValue}
          />
          <StyledTextFieldNumber
            disabled={checkLoading}
            error={!!LTVError}
            label="Payoff Amount"
            onValueChange={({ floatValue }) => {
              setRateData({
                ...(rateData as BridgeRefinanceEstimateRateData),
                balance: floatValue,
              });
            }}
            prefix={'$'}
            value={rateData?.balance}
          />
          {/* {!rateData?.isCor && ( */}
          <StyledTextFieldNumber
            disabled
            label="Loan-to-Value"
            onValueChange={() => undefined}
            percentage
            suffix={'%'}
            thousandSeparator={false}
            value={POSFormatLocalPercent(LTV)}
          />
          {/* )} */}
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
            checked={rateData?.isCashOut}
            disabled={checkLoading}
            label={'Cash out'}
            onChange={(e) => {
              setRateData({
                ...(rateData as BridgeRefinanceEstimateRateData),
                isCashOut: e.target.checked,
              });
            }}
          />
        </Stack>
        <Stack
          sx={{ display: rateData?.isCashOut ? 'block' : 'none' }}
          width={'100%'}
        >
          <Transitions>
            {rateData?.isCashOut && (
              <StyledTextFieldNumber
                disabled={checkLoading}
                error={!!LTCError}
                label={'Cash out amount'}
                onValueChange={({ floatValue }) => {
                  setRateData({
                    ...rateData,
                    cashOutAmount: floatValue,
                  });
                }}
                prefix={'$'}
                value={rateData?.cashOutAmount || undefined}
              />
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
                ...(rateData as BridgeRefinanceEstimateRateData),
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
              <Stack gap={3} width={'100%'}>
                <StyledTextFieldNumber
                  decimalScale={3}
                  disabled={checkLoading}
                  error={!!brokerPointsError}
                  label="Broker origination fee"
                  onValueChange={({ floatValue }) =>
                    setRateData({
                      ...(rateData as BridgeRefinanceEstimateRateData),
                      brokerPoints: floatValue,
                    })
                  }
                  suffix={'%'}
                  thousandSeparator={false}
                  value={rateData?.brokerPoints}
                />
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  error={!!brokerFeeError}
                  label="Broker processing fee"
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...(rateData as BridgeRefinanceEstimateRateData),
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

  const infoRef = useRef<HTMLInputElement | null>(null);

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
