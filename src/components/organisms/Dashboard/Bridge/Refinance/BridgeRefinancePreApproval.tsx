import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useAsyncEffect } from '@/hooks';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_USER_TYPE } from '@/constants';
import { Address, IAddress } from '@/models/common/Address';
import { LoanStage, UserType } from '@/types/enum';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSNotUndefined,
} from '@/utils';
import {
  BREstimateRateData,
  BRPreApprovalLetterData,
  HttpError,
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

  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

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
  const [rateData, setRateData] = useState<BREstimateRateData>();

  const [LTVError, setLTVError] = useState<undefined | string[]>(undefined);

  const [productData, setProductData] = useState<RatesProductData>();

  const [checkResult, setCheckResult] = useState<unknown>();
  const [checkLoading, setCheckLoading] = useState<boolean>(false);

  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  const editLoanAmount = useMemo(() => {
    let total = rateData?.balance || 0;
    if (rateData?.isCashOut) {
      total += rateData?.cashOutAmount || 0;
    }
    return total;
  }, [rateData?.balance, rateData?.isCashOut, rateData?.cashOutAmount]);

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
    if (editLoanAmount < 100000) {
      setLTVError(['Total loan amount must be at least $100,000']);
    }
    return total / rateData?.homeValue;
  }, [
    editLoanAmount,
    rateData?.balance,
    rateData?.cashOutAmount,
    rateData?.homeValue,
    rateData?.isCashOut,
  ]);

  const [initState, getInitData] = useAsyncFn(async (processId: string) => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchPreApprovedLetterInfo<BRPreApprovalLetterData>(processId)
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
          isCashOut,
          cashOutAmount,
          balance,
          homeValue,
          brokerPoints,
          brokerProcessingFee,
          lenderPoints,
          lenderProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        } = data;
        setRateData({
          isCashOut,
          cashOutAmount,
          balance,
          homeValue,
          brokerPoints,
          brokerProcessingFee,
          lenderPoints,
          lenderProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        });
        setFirstLoading(false);
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () => {
            router.push('/pipeline');
            setFirstLoading(false);
          },
        });
      });
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
      postData as BRPreApprovalLetterData,
    );
    if (status === 200) {
      setCheckResult(!!data);
      setProductData(data);
    }
    setCheckLoading(false);
  }, [address, router.query.processId, propertyType, propertyUnit, rateData]);

  const onClickUpdate = useCallback(async () => {
    setUploadLoading(true);
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
    try {
      await _updateRatesProductSelected(
        router.query.processId as string,
        postData as UpdateRatesPostData,
      );
      setCheckResult(undefined);
      setTableStatus('view');
      await getInitData(router.query.processId as string);
      enqueueSnackbar('Update Successfully!' as string, {
        variant: 'success',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUploadLoading(false);
    }
  }, [
    address,
    productData?.id,
    propertyType,
    propertyUnit,
    rateData,
    router.query.processId,
    getInitData,
    enqueueSnackbar,
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
    if (uploadLoading || checkLoading) {
      return false;
    }
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
      !userCondition
    ) {
      return false;
    }
    if (propertyType === PropertyOpt.twoToFourFamily) {
      return !!propertyUnit;
    }
    if (rateData?.isCashOut) {
      return !!rateData.cashOutAmount;
    }
    return true;
  }, [
    uploadLoading,
    checkLoading,
    userType,
    address?.checkAddressValid,
    propertyType,
    LTVError,
    rateData?.isCashOut,
    rateData?.brokerPoints,
    rateData?.brokerProcessingFee,
    rateData?.lenderPoints,
    rateData?.lenderProcessingFee,
    rateData?.officerPoints,
    rateData?.officerProcessingFee,
    rateData?.agentFee,
    rateData?.cashOutAmount,
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
    let additionalCondition;
    switch (userType) {
      case UserType.BROKER:
        additionalCondition = (
          <>
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={checkLoading}
              label="Broker origination fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              label="Broker processing fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              label="Lender origination fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              label="Lender processing fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              label="Loan officer origination fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              label="Loan officer processing fee"
              onValueChange={({ floatValue }) => {
                setRateData({
                  ...(rateData as BREstimateRateData),
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
              decimalScale={3}
              disabled={checkLoading}
              label="Real estate agent referral fee"
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BREstimateRateData),
                  agentFee: floatValue,
                })
              }
              percentage
              suffix={'%'}
              thousandSeparator={false}
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
            label="As-is property value"
            onValueChange={({ floatValue }) =>
              setRateData({
                ...(rateData as BREstimateRateData),
                homeValue: floatValue,
              })
            }
            prefix={'$'}
            value={rateData?.homeValue}
          />
          <StyledTextFieldNumber
            disabled={checkLoading}
            error={!!LTVError}
            label="Payoff amount"
            onValueChange={({ floatValue }) => {
              setRateData({
                ...(rateData as BREstimateRateData),
                balance: floatValue,
              });
            }}
            prefix={'$'}
            value={rateData?.balance}
          />
          <StyledTextFieldNumber
            disabled
            label="Loan-to-value"
            onValueChange={() => undefined}
            percentage
            suffix={'%'}
            thousandSeparator={false}
            validate={LTVError}
            value={POSFormatLocalPercent(LTV)}
          />
        </Stack>

        <Stack width={'100%'}>
          <StyledCheckbox
            checked={rateData?.isCashOut}
            disabled={checkLoading}
            label={'Cash Out'}
            onChange={(e) => {
              setRateData({
                ...(rateData as BREstimateRateData),
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
                value={rateData?.cashOutAmount || undefined}
              />
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
    pointsError,
    processingFeeError,
    agentFeeError,
  ]);

  const infoRef = useRef<HTMLInputElement | null>(null);

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {initState.loading || firstLoading ? (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey', m: 0 }} />
        </Stack>
      ) : (
        <>
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
        </>
      )}
    </Transitions>
  );
});
