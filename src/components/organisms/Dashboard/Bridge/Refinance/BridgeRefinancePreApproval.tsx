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
import {
  POSFormatDollar,
  POSFormatLocalPercent,
  POSFormatPercent,
} from '@/utils';
import {
  BPPreApprovalLetterData,
  BridgeRefinanceEstimateRateData,
  BRPreApprovalLetterData,
  MPPreApprovalLetterBRData,
  MPPreApprovalLetterData,
  PropertyOpt,
  PropertyUnitOpt,
  RatesProductData,
} from '@/types';
import { LoanStage, UserType } from '@/types/enum';
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
    // if (rateData?.isCor) {
    //   setLTVError(undefined);
    // }
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

  // const onDialogSendEmailClick = useCallback(() => {
  //   close();
  //   setTimeout(() => {
  //     infoRef.current?.focus();
  //   });
  // }, [close]);

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
      postData as
        | BRPreApprovalLetterData
        | BPPreApprovalLetterData
        | MPPreApprovalLetterData,
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
      // open();
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

    if (!brokerProcessingFee || !editLoanAmount) {
      return [''];
    }
    if (brokerProcessingFee <= editLoanAmount) {
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
        ? rateData?.brokerPoints &&
          rateData?.brokerProcessingFee &&
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
        mt={3}
        p={3}
        width={'100%'}
      >
        {checkLoading ? (
          <StyledLoading
            sx={{ justifyContent: 'flex-start', color: 'primary.main' }}
          />
        ) : checkResult ? (
          <Box>
            <Box fontWeight={700}>Your updated loan product</Box>
            <Box mt={1}>
              Based on that new info, here&apos;s an updated rate and loan you
              might like
            </Box>
            <Box fontWeight={700} mt={1}>
              {POSFormatLocalPercent(productData?.interestRateOfYear)} Rate /{' '}
              {productData?.loanTerm} months /{' '}
              {POSFormatDollar(productData?.paymentOfMonth)} Monthly payment
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <StyledButton
                color={'primary'}
                disabled={!clickable}
                onClick={onClickUpdate}
                sx={{ mt: 3 }}
                variant={'contained'}
              >
                Update
              </StyledButton>
            </Box>
          </Box>
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
        <Stack
          flexDirection={{ lg: 'row', xs: 'column' }}
          gap={3}
          width={'100%'}
        >
          <StyledTextFieldNumber
            disabled={checkLoading}
            label="As-is Property Value"
            onValueChange={({ floatValue }) =>
              setRateData({
                ...(rateData as BridgeRefinanceEstimateRateData),
                homeValue: floatValue,
              })
            }
            prefix={'$'}
            validate={LTVError}
            value={rateData?.homeValue}
          />
          <StyledTextFieldNumber
            disabled={checkLoading}
            label="Payoff Amount"
            onValueChange={({ floatValue }) => {
              setRateData({
                ...(rateData as BridgeRefinanceEstimateRateData),
                balance: floatValue,
              });
            }}
            prefix={'$'}
            validate={LTVError}
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
            value={POSFormatPercent(LTV)}
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
                label={'Cash out amount'}
                onValueChange={({ floatValue }) => {
                  setRateData({
                    ...rateData,
                    cashOutAmount: floatValue,
                  });
                }}
                prefix={'$'}
                validate={LTCError}
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
              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  // validate={!!LTCError}
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
                  // validate={!!LTCError}
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
                  value={POSFormatPercent(LTC)}
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
                  label="Broker origination fee"
                  onValueChange={({ floatValue }) =>
                    setRateData({
                      ...(rateData as BridgeRefinanceEstimateRateData),
                      brokerPoints: floatValue,
                    })
                  }
                  suffix={'%'}
                  thousandSeparator={false}
                  validate={brokerPointsError}
                  value={rateData?.brokerPoints}
                />
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  label="Broker processing fee"
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...(rateData as BridgeRefinanceEstimateRateData),
                      brokerProcessingFee: floatValue,
                    });
                  }}
                  prefix={'$'}
                  validate={brokerFeeError}
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
      {/* <StyledDialog
         content={
         <>
         '& .updatedImage': {
         display: 'inline-block',
         width: 192,
         height: 160,
         marginBlockEnd: 24,
         background:
         'url(/PreapprovalLetter/letter-1.png) no-repeat center / contain',
         },
         
         <Box className={'updatedImage'} />
         '& .updatedTip': {
         ...POSFont(16, 700, 1.5, 'rgba(0, 0, 0, 0.87)'),
         paddingInline: 60,
         fontSize: 24,
         },
         <Box className={'updatedTip'}>
         Your pre-approval letter has already been updated!
         </Box>
         </>
         }
         footer={
         <>
         <StyledButton
         onClick={() => router.push('/dashboard/rates')}
         variant={'outlined'}
         >
         Go to Rates
         </StyledButton>
         <StyledButton
         color={'primary'}
         disableElevation
         onClick={onDialogSendEmailClick}
         variant={'contained'}
         >
         Send Email
         </StyledButton>
         </>
         }
         onClose={close}
         open={visible}
         ></StyledDialog> */}
    </Box>
  );
});
