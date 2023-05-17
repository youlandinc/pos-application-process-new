import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import { useAsyncFn } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { useAsyncEffect, useSwitch } from '@/hooks';

import { useSnackbar } from 'notistack';
import { Address, IAddress } from '@/models/common/Address';

import { POSFont } from '@/styles';
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
  StyledDialog,
  StyledLoading,
  StyledTextFieldNumber,
  Transitions,
} from '@/components/atoms';
import { PreApprovalEdit, PreApprovalInfo } from '@/components/molecules';

import { LoanStage, UserType } from '@/types/enum';
import {
  POSFormatDollar,
  POSFormatLocalPercent,
  POSNotUndefined,
} from '@/utils';
import { AUTO_HIDE_DURATION } from '@/constants';

const useStyles = {
  mx: { lg: 'auto', xs: 0 },
  '& .resultBox': {
    ...POSFont(16, 400, 1.5, '#3F51B5'),
    mt: 3,
    background: '#F5F8FA',
    width: '100%',
    p: 3,
    borderRadius: 2,
  },

  '& .updatedImage': {
    display: 'inline-block',
    width: 192,
    height: 160,
    marginBlockEnd: 24,
    background:
      'url(/PreapprovalLetter/letter-1.png) no-repeat center / contain',
  },
  '& .updatedTip': {
    ...POSFont(16, 700, 1.5, 'rgba(0, 0, 0, 0.87)'),
    paddingInline: 60,
    fontSize: 24,
  },
} as const;

export const BridgePurchasePreApproval: FC = observer(() => {
  const {
    userSetting: {
      setting: { lastSelectedProcessId },
    },
    userType,
  } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { open, visible, close } = useSwitch(false);

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

  const [initState, getInitData] = useAsyncFn(
    async (lastSelectedProcessId: string) => {
      return await _fetchPreApprovedLetterInfo<MPPreApprovalLetterBPData>(
        lastSelectedProcessId,
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
          }),
        );
    },
    [],
  );

  useAsyncEffect(async () => {
    await getInitData(lastSelectedProcessId as string);
  }, [lastSelectedProcessId]);

  const onDialogSendEmailClick = useCallback(() => {
    close();
    setTimeout(() => {
      infoRef.current?.focus();
    });
  }, [close]);

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
        lastSelectedProcessId,
        postData as MPPreApprovalLetterBPData,
      );
    if (status === 200) {
      setCheckResult(!!data);
      setProductData(data);
    }
    setCheckLoading(false);
  }, [address, lastSelectedProcessId, propertyType, propertyUnit, rateData]);

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
      lastSelectedProcessId,
      postData as UpdateRatesPostData,
    );
    if (res.status === 200) {
      open();
      setCheckResult(undefined);
      setTableStatus('view');
      await getInitData(lastSelectedProcessId as string);
    }
  }, [
    address,
    getInitData,
    lastSelectedProcessId,
    open,
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
      <Box className={'resultBox'}>
        {checkLoading ? (
          <StyledLoading
            // iconSize={size(24)}
            sx={{ justifyContent: 'flex-start' }}
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
            label="Purchase price"
            onValueChange={({ floatValue }) =>
              setRateData({
                ...(rateData as BridgePurchaseEstimateRateData),
                purchasePrice: floatValue,
              })
            }
            prefix={'$'}
            validate={LTVError}
            value={rateData?.purchasePrice}
          />
          <StyledTextFieldNumber
            disabled={checkLoading}
            label="Purchase loan amount"
            onValueChange={({ floatValue }) => {
              setRateData({
                ...(rateData as BridgePurchaseEstimateRateData),
                purchaseLoanAmount: floatValue,
              });
            }}
            prefix={'$'}
            validate={LTVError}
            value={rateData?.purchaseLoanAmount}
          />
          {!rateData?.isCor && (
            <StyledTextFieldNumber
              disabled
              label="Loan-to-Value"
              onValueChange={() => undefined}
              prefix={''}
              value={POSFormatLocalPercent(LTV)}
            />
          )}
        </Stack>
        <Transitions>
          {LTVError && (
            <Stack color={'error.main'} width={'100%'}>
              {LTVError}
            </Stack>
          )}
        </Transitions>
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
              <Stack
                flexDirection={{ lg: 'row', xs: 'column' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  label={'Estimated rehab loan amount'}
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...rateData,
                      cor: floatValue,
                    });
                  }}
                  validate={LTCError}
                  value={rateData?.cor || undefined}
                />
                <StyledTextFieldNumber
                  disabled={checkLoading}
                  label={'After repair value (ARV)'}
                  onValueChange={({ floatValue }) => {
                    setRateData({
                      ...rateData,
                      arv: floatValue,
                    });
                  }}
                  validate={LTCError}
                  value={rateData?.arv || undefined}
                />
                <StyledTextFieldNumber
                  disabled
                  label={'Loan-to-Cost'}
                  onValueChange={() => undefined}
                  prefix={''}
                  value={POSFormatLocalPercent(LTC)}
                />
              </Stack>
            )}
          </Transitions>
        </Stack>

        <Transitions>
          {LTCError && (
            <Stack color={'error.main'} width={'100%'}>
              {LTCError}
            </Stack>
          )}
        </Transitions>
        {userType === UserType.BROKER && (
          <Stack
            flexDirection={{ lg: 'row', xs: 'column' }}
            gap={3}
            width={'100%'}
          >
            <StyledTextFieldNumber
              decimalScale={3}
              disabled={checkLoading}
              label="Broker origination fee "
              onValueChange={({ floatValue }) =>
                setRateData({
                  ...(rateData as BridgePurchaseEstimateRateData),
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
                  ...(rateData as BridgePurchaseEstimateRateData),
                  brokerProcessingFee: floatValue,
                });
              }}
              validate={brokerFeeError}
              value={rateData?.brokerProcessingFee}
            />
          </Stack>
        )}
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
    <Box sx={useStyles}>
      {tableStatus === 'view' ? (
        <PreApprovalInfo
          lastSelectedProcessId={lastSelectedProcessId}
          loading={initState.loading}
          loanAmount={loanAmount}
          loanStage={loanStage}
          onClickEdit={onChangeTableStatus}
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
      <StyledDialog
        content={
          <>
            <Box className={'updatedImage'} />
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
      />
    </Box>
  );
});
