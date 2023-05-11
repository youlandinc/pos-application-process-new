//import { FC, useCallback, useMemo, useRef, useState } from 'react';
//
//import { useAsyncFn } from 'react-use';
//
//import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';
//import { useAsyncEffect, useSwitch } from '@/hooks';
//
//// import { Address, IAddress } from '@/models/modules';
//
//import { POSFlex, POSFont } from '@/styles';
//// import { PropertyOpt, UnitOpt } from '@/types/options';
//// import { BridgeRefinanceEstimateRateData } from '@/types/variable';
//// import {
////   PreApprovalLetterBRData,
////   RatesProductData,
//// } from '@/types/dashboardData';
//import {
//  _fetchPreApprovedLetterCheck,
//  _fetchPreApprovedLetterInfo,
//  _updateRatesProductSelected,
//} from '@/requests/dashboard';
//import {
//  StyledButton,
//  StyledCheckbox,
//  StyledDialog,
//  StyledLoading,
//  StyledTextFieldNumber,
//  Transitions,
//} from '@/components/atoms';
//import { PreApprovalEdit, PreApprovalInfo } from '@/components';
//import { useRouter } from 'next/router';
//import { LoanStage, UserType } from '@/types/enum';
//import { Box, FormControlLabel, Stack } from '@mui/material';
//import {
//  POSFormatDollar,
//  POSFormatLocalPercent,
//  POSFormatPercent,
//} from '@/utils';
//import { Address, IAddress } from '@/models/common/Address';
//import {
//  BridgeRefinanceEstimateRateData,
//  MPPreApprovalLetterBRData,
//  PropertyOpt,
//  PropertyUnitOpt,
//  RatesProductData,
//} from '@/types';
//
//const useStyles = {
//  mx: { lg: 'auto', xs: 0 },
//  '& .formRow': {
//    ...POSFlex('flex-start', 'space-between', 'row'),
//    gap: 50,
//    marginBlockEnd: 24,
//    '& > *': {
//      flex: 1,
//    },
//    '& > :last-child:nth-of-type(2)': {
//      flex: 0.4545,
//    },
//  },
//  '& .checkbox': {
//    ...POSFlex('center', 'flex-start', 'row'),
//    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.87)'),
//    marginLeft: 0,
//    marginBottom: 24,
//    width: 400,
//    cursor: 'pointer',
//    userSelect: 'none',
//  },
//  '& .resultBox': {
//    ...POSFont(16, 400, 1.5, '#3F51B5'),
//    mt: 3,
//    background: '#F5F8FA',
//    width: '100%',
//    p: 3,
//    borderRadius: 2,
//  },
//  '& .dialogPaper': {
//    maxWidth: 500,
//    borderRadius: 8,
//  },
//  '& .dialogContent': {
//    lineHeight: 1.5,
//    textAlign: 'center',
//    '&, &:first-of-type': {
//      padding: 48,
//    },
//  },
//  '& .updatedImage': {
//    display: 'inline-block',
//    width: 192,
//    height: 160,
//    marginBlockEnd: 24,
//    background:
//      'url(/PreapprovalLetter/letter-1.png) no-repeat center / contain',
//  },
//  '& .updatedTip': {
//    ...POSFont(16, 700, 1.5, 'rgba(0, 0, 0, 0.87)'),
//    paddingInline: 60,
//    fontSize: 24,
//  },
//  '& .updatedActions': {
//    display: 'flex',
//    gap: 9,
//    marginBlockStart: 48,
//    '& > *': {
//      flex: 1,
//    },
//  },
//  '& .secondButton': {
//    ...POSFont(16, 700, 1.5, '#ffffff'),
//    textTransform: 'none',
//    background: '#7B96B5',
//    minWidth: 200,
//    height: 50,
//    borderRadius: 8,
//    '&:hover': {
//      background: '#446B99',
//    },
//  },
//} as const;
//
//export const BridgeRefinancePreApproval: FC = observer(() => {
//  const {
//    userSetting: {
//      setting: { lastSelectedProcessId },
//    },
//    userType,
//  } = useMst();
//
//  const router = useRouter();
//
//  const { open, visible, close } = useSwitch(false);
//
//  const [loanStage, setLoanStage] = useState<LoanStage | undefined>(
//    LoanStage.PreApproved,
//  );
//  const [loanAmount, setLoanAmount] = useState<number>();
//  const [tableStatus, setTableStatus] = useState<'edit' | 'view'>('view');
//  const [propertyUnit, setPropertyUnit] = useState<PropertyUnitOpt>(
//    PropertyUnitOpt.default,
//  );
//  const [propertyType, setPropertyType] = useState<PropertyOpt>(
//    PropertyOpt.default,
//  );
//  const [address, setAddress] = useState<IAddress>(
//    Address.create({
//      formatAddress: '',
//      state: '',
//      street: '',
//      city: '',
//      aptNumber: '',
//      postcode: '',
//      isValid: false,
//      errors: {},
//    }),
//  );
//  const [rateData, setRateData] = useState<BridgeRefinanceEstimateRateData>();
//
//  const [LTVError, setLTVError] = useState<undefined | string[]>(undefined);
//  const [LTCError, setLTCError] = useState<undefined | string[]>(undefined);
//
//  const [productData, setProductData] = useState<RatesProductData>();
//
//  const [checkResult, setCheckResult] = useState<unknown>();
//  const [checkLoading, setCheckLoading] = useState<boolean>(false);
//
//  const editLoanAmount = useMemo(() => {
//    let total = rateData?.balance || 0;
//    if (rateData?.isCor) {
//      total += rateData?.cor || 0;
//    }
//    if (rateData?.isCashOut) {
//      total += rateData?.cashOutAmount || 0;
//    }
//    return total;
//  }, [
//    rateData?.balance,
//    rateData?.isCor,
//    rateData?.isCashOut,
//    rateData?.cor,
//    rateData?.cashOutAmount,
//  ]);
//
//  const LTV = useMemo(() => {
//    let radio = 0.7;
//    if (!rateData?.homeValue) {
//      return 0;
//    }
//    if (rateData?.isCor) {
//      setLTVError(undefined);
//      return;
//    }
//    let total = rateData?.balance || 0;
//    if (rateData?.isCashOut) {
//      total += rateData?.cashOutAmount || 0;
//      radio = 0.7;
//    } else {
//      radio = 0.65;
//    }
//    setLTVError(
//      total / rateData?.homeValue <= radio
//        ? undefined
//        : [`Your LTV should be no more than ${radio * 100}%`],
//    );
//    if (editLoanAmount < 150000) {
//      setLTVError(['Total loan amount must be at least $150,000']);
//    }
//    return total / rateData?.homeValue;
//  }, [
//    editLoanAmount,
//    rateData?.balance,
//    rateData?.cashOutAmount,
//    rateData?.homeValue,
//    rateData?.isCashOut,
//    rateData?.isCor,
//  ]);
//
//  const LTC = useMemo(() => {
//    const result =
//      rateData?.cor === 0
//        ? 0
//        : (loanAmount as number) /
//          ((rateData?.cor as number) + (rateData?.homeValue as number));
//    setLTCError(
//      !rateData?.isCor
//        ? undefined
//        : result > 0.75
//        ? [
//            'Reduce your cash out amount or rehab cost. Your Loan-to-Cost should be no more than 75%',
//          ]
//        : undefined,
//    );
//    return result;
//  }, [loanAmount, rateData?.cor, rateData?.homeValue, rateData?.isCor]);
//
//  const [initState, getInitData] = useAsyncFn(
//    async (lastSelectedProcessId: string) => {
//      return await _fetchPreApprovedLetterInfo<MPPreApprovalLetterBRData>(
//        lastSelectedProcessId,
//      )
//        .then((res) => {
//          const { data } = res;
//          setLoanStage(data?.loanStage);
//          setLoanAmount(data.loanAmount);
//          setPropertyType(data?.propertyType);
//          setPropertyUnit(data.propertyUnit);
//          setAddress(
//            Address.create({
//              formatAddress: data?.propAddr?.address,
//              state: data.propAddr?.state ?? '',
//              street: '',
//              city: data.propAddr?.city ?? '',
//              aptNumber: data.propAddr?.aptNumber ?? '',
//              postcode: data.propAddr?.postcode ?? '',
//              isValid: false,
//              errors: {},
//            }),
//          );
//          const {
//            cor,
//            isCor,
//            isCashOut,
//            cashOutAmount,
//            balance,
//            homeValue,
//            arv,
//            brokerPoints,
//            brokerProcessingFee,
//          } = data;
//          setRateData({
//            cor,
//            isCor,
//            isCashOut,
//            cashOutAmount,
//            balance,
//            homeValue,
//            arv,
//            brokerPoints,
//            brokerProcessingFee,
//          });
//        })
//        .catch((err) => console.log(err));
//    },
//    [],
//  );
//
//  useAsyncEffect(async () => {
//    await getInitData(lastSelectedProcessId as string);
//  }, [lastSelectedProcessId]);
//
//  const onDialogSendEmailClick = useCallback(() => {
//    close();
//    setTimeout(() => {
//      infoRef.current?.focus();
//    });
//  }, [close]);
//
//  const onChangeTableStatus = useCallback(() => {
//    setTableStatus(tableStatus === 'edit' ? 'view' : 'edit');
//    setCheckResult(undefined);
//  }, [tableStatus]);
//
//  const onClickCheck = useCallback(async () => {
//    setCheckLoading(true);
//    setCheckResult(true);
//    setProductData(undefined);
//    const postData = {
//      propAddr: address?.getPostData(),
//      propertyUnit,
//      propertyType,
//      ...rateData,
//    };
//    const { data, status } =
//      await _fetchPreApprovedLetterCheck<MPPreApprovalLetterBRData>(
//        lastSelectedProcessId,
//        postData,
//      );
//    if (status === 200) {
//      setCheckResult(!!data);
//      setProductData(data);
//    }
//    setCheckLoading(false);
//  }, [address, lastSelectedProcessId, propertyType, propertyUnit, rateData]);
//
//  const onClickUpdate = useCallback(async () => {
//    const addressData = address?.getPostData();
//    const postData = {
//      id: productData?.id,
//      queryParams: {
//        propAddr: addressData,
//        propertyType,
//        propertyUnit,
//        ...rateData,
//      },
//    };
//    const res = await _updateRatesProductSelected(
//      lastSelectedProcessId,
//      postData,
//    );
//    if (res.status === 200) {
//      open();
//      setCheckResult(undefined);
//      setTableStatus('view');
//      await getInitData(lastSelectedProcessId as string);
//    }
//  }, [
//    address,
//    getInitData,
//    lastSelectedProcessId,
//    open,
//    productData?.id,
//    propertyType,
//    propertyUnit,
//    rateData,
//  ]);
//
//  const brokerPointsError = useMemo(() => {
//    const { brokerPoints } = rateData || {};
//
//    if (!brokerPoints) {
//      return [''];
//    }
//    if (brokerPoints <= 5) {
//      return undefined;
//    }
//    return ['Broker origination fee must be lesser than or equal to 5%.'];
//  }, [rateData]);
//
//  const brokerFeeError = useMemo(() => {
//    const { brokerProcessingFee } = rateData || {};
//
//    if (!brokerProcessingFee || !editLoanAmount) {
//      return [''];
//    }
//    if (brokerProcessingFee <= editLoanAmount) {
//      return undefined;
//    }
//    return [
//      `Broker origination fee must be lesser than or equal to ${POSFormatDollar(
//        editLoanAmount,
//      )}.`,
//    ];
//  }, [rateData, editLoanAmount]);
//
//  const clickable = useMemo(() => {
//    const brokerCondition =
//      userType === UserType.BROKER
//        ? rateData?.brokerPoints &&
//          rateData?.brokerProcessingFee &&
//          !brokerPointsError &&
//          !brokerFeeError
//        : true;
//
//    if (
//      !propertyType ||
//      !address?.checkAddressValid ||
//      !!LTVError ||
//      !!LTCError ||
//      !brokerCondition
//    ) {
//      return false;
//    }
//    if (propertyType === PropertyOpt.twoToFourFamily) {
//      return !!propertyUnit;
//    }
//    if (rateData?.isCor) {
//      return !!(rateData.cor && rateData.arv);
//    }
//    if (rateData?.isCashOut) {
//      return !!rateData.cashOutAmount;
//    }
//    return true;
//  }, [
//    userType,
//    rateData?.brokerPoints,
//    rateData?.brokerProcessingFee,
//    rateData?.isCor,
//    rateData?.isCashOut,
//    rateData?.cor,
//    rateData?.arv,
//    rateData?.cashOutAmount,
//    brokerPointsError,
//    brokerFeeError,
//    propertyType,
//    address?.checkAddressValid,
//    LTVError,
//    LTCError,
//    propertyUnit,
//  ]);
//
//  const renderResultList = useMemo(() => {
//    return typeof checkResult !== 'undefined' ? (
//      <Box className={'resultBox'}>
//        {checkLoading ? (
//          <StyledLoading
//            // iconSize={size(24)}
//            sx={{ justifyContent: 'flex-start' }}
//          />
//        ) : checkResult ? (
//          <Box>
//            <Box fontWeight={700}>Your updated loan product</Box>
//            <Box mt={1}>
//              Based on that new info, here&apos;s an updated rate and loan you
//              might like
//            </Box>
//            <Box fontWeight={700} mt={1}>
//              {POSFormatLocalPercent(productData?.interestRateOfYear)} Rate /{' '}
//              {productData?.loanTerm} months /{' '}
//              {POSFormatDollar(productData?.paymentOfMonth)} Monthly payment
//            </Box>
//            <Box sx={{ textAlign: 'center' }}>
//              <StyledButton
//                color={'primary'}
//                disabled={!clickable}
//                onClick={onClickUpdate}
//                style={{ marginBlockStart: 24 }}
//                variant={'contained'}
//              >
//                Update
//              </StyledButton>
//            </Box>
//          </Box>
//        ) : (
//          <Box>
//            Based on your information, we couldn&apos;t find any rate options.
//            Please try again.
//          </Box>
//        )}
//      </Box>
//    ) : null;
//  }, [
//    clickable,
//    checkLoading,
//    checkResult,
//    onClickUpdate,
//    productData?.interestRateOfYear,
//    productData?.loanTerm,
//    productData?.paymentOfMonth,
//  ]);
//
//  const renderEditChildren = useMemo(() => {
//    return (
//      <>
//        <Stack
//          flexDirection={{ lg: 'row', xs: 'column' }}
//          gap={3}
//          width={'100%'}
//        >
//          <StyledTextFieldNumber
//            disabled={checkLoading}
//            label="Estimated home value"
//            onValueChange={({ floatValue }) =>
//              setRateData({
//                ...rateData,
//                homeValue: floatValue,
//              })
//            }
//            prefix={'$'}
//            validate={LTVError}
//            value={rateData?.homeValue}
//          />
//          <StyledTextFieldNumber
//            disabled={checkLoading}
//            label="Remaining loan balance"
//            onValueChange={({ floatValue }) => {
//              setRateData({
//                ...rateData,
//                balance: floatValue,
//              });
//            }}
//            prefix={'$'}
//            validate={LTVError}
//            value={rateData?.balance}
//          />
//          {!rateData?.isCor && (
//            <StyledTextFieldNumber
//              disabled
//              label="Loan-to-Value"
//              onValueChange={() => undefined}
//              suffix={'%'}
//              value={POSFormatPercent(LTV)}
//            />
//          )}
//        </Stack>
//        <Transitions>
//          {LTVError && (
//            <Stack color={'#ef5350'} width={'100%'}>
//              {LTVError}
//            </Stack>
//          )}
//        </Transitions>
//        <Stack width={'100%'}>
//          <StyledCheckbox
//            checked={rateData?.isCashOut}
//            disabled={checkLoading}
//            label={'Cash out'}
//            onChange={(e) => {
//              setRateData({
//                ...rateData,
//                isCashOut: e.target.checked,
//              });
//            }}
//          />
//        </Stack>
//        <Stack
//          sx={{ display: rateData?.isCashOut ? 'block' : 'none' }}
//          width={'100%'}
//        >
//          <Transitions>
//            {rateData?.isCashOut && (
//              <StyledTextFieldNumber
//                disabled={checkLoading}
//                label={'Cash out amount'}
//                onValueChange={({ floatValue }) => {
//                  setRateData({
//                    ...rateData,
//                    cashOutAmount: floatValue,
//                  });
//                }}
//                prefix={'$'}
//                validate={LTCError}
//                value={rateData?.cashOutAmount || undefined}
//              />
//            )}
//          </Transitions>
//        </Stack>
//        <Stack width={'100%'}>
//          <StyledCheckbox
//            checked={rateData?.isCor}
//            disabled={checkLoading}
//            label={'Rehab loan amount'}
//            onChange={(e) => {
//              setRateData({
//                ...rateData,
//                isCor: e.target.checked,
//              });
//            }}
//          />
//        </Stack>
//
//        <Stack
//          sx={{ display: rateData?.isCor ? 'block' : 'none' }}
//          width={'100%'}
//        >
//          <Transitions>
//            {rateData?.isCor && (
//              <Stack
//                flexDirection={{ lg: 'row', xs: 'column' }}
//                gap={3}
//                width={'100%'}
//              >
//                <StyledTextFieldNumber
//                  disabled={checkLoading}
//                  // validate={!!LTCError}
//                  label={'Estimated rehab loan amount'}
//                  onValueChange={({ floatValue }) => {
//                    setRateData({
//                      ...rateData,
//                      cor: floatValue,
//                    });
//                  }}
//                  prefix={'$'}
//                  value={rateData?.cor || undefined}
//                />
//                <StyledTextFieldNumber
//                  disabled={checkLoading}
//                  // validate={!!LTCError}
//                  label={'After repair value (ARV)'}
//                  onValueChange={({ floatValue }) => {
//                    setRateData({
//                      ...rateData,
//                      arv: floatValue,
//                    });
//                  }}
//                  prefix={'$'}
//                  value={rateData?.arv || undefined}
//                />
//                <StyledTextFieldNumber
//                  disabled
//                  label={'Loan-to-Cost'}
//                  onValueChange={() => undefined}
//                  suffix={'%'}
//                  value={POSFormatPercent(LTC)}
//                />
//              </Stack>
//            )}
//          </Transitions>
//        </Stack>
//
//        <Transitions>
//          {LTCError && (
//            <Stack color={'#ef5350'} mt={'24px'} width={'100%'}>
//              {LTCError}
//            </Stack>
//          )}
//        </Transitions>
//        {userType === UserType.BROKER && (
//          <Stack
//            flexDirection={{ lg: 'row', xs: 'column' }}
//            gap={3}
//            width={'100%'}
//          >
//            <StyledTextFieldNumber
//              decimalScale={3}
//              disabled={checkLoading}
//              label="Broker origination fee"
//              onValueChange={({ floatValue }) =>
//                setRateData({
//                  ...rateData,
//                  brokerPoints: floatValue,
//                })
//              }
//              suffix={'%'}
//              thousandSeparator={false}
//              validate={brokerPointsError}
//              value={rateData?.brokerPoints}
//            />
//            <StyledTextFieldNumber
//              disabled={checkLoading}
//              label="Broker processing fee"
//              onValueChange={({ floatValue }) => {
//                setRateData({
//                  ...rateData,
//                  brokerProcessingFee: floatValue,
//                });
//              }}
//              prefix={'$'}
//              validate={brokerFeeError}
//              value={rateData?.brokerProcessingFee}
//            />
//          </Stack>
//        )}
//      </>
//    );
//  }, [
//    LTVError,
//    rateData,
//    checkLoading,
//    LTV,
//    LTCError,
//    LTC,
//    userType,
//    brokerPointsError,
//    brokerFeeError,
//  ]);
//
//  const infoRef = useRef<HTMLInputElement | null>(null);
//
//  return (
//    <Box sx={useStyles}>
//      {tableStatus === 'view' ? (
//        <PreApprovalInfo
//          lastSelectedProcessId={lastSelectedProcessId}
//          loading={initState.loading}
//          loanAmount={loanAmount}
//          loanStage={loanStage}
//          onClickEdit={onChangeTableStatus}
//          ref={infoRef}
//        />
//      ) : (
//        <>
//          <PreApprovalEdit
//            address={address}
//            // children={renderEditChildren}
//            clickable={!clickable}
//            editable={checkLoading}
//            onClickCancel={onChangeTableStatus}
//            onClickCheck={onClickCheck}
//            onTypeChange={setPropertyType}
//            onUnitChange={setPropertyUnit}
//            propertyType={propertyType}
//            propertyUnit={propertyUnit}
//            resultList={renderResultList}
//          >
//            {renderEditChildren}
//          </PreApprovalEdit>
//        </>
//      )}
//      <StyledDialog
//        content={
//          <>
//            <Box className={'updatedImage'} />
//            <Box className={'updatedTip'}>
//              Your pre-approval letter has already been updated!
//            </Box>
//          </>
//        }
//        footer={
//          <>
//            <StyledButton
//              onClick={() => router.push('/dashboard/rates')}
//              variant={'outlined'}
//            >
//              Go to Rates
//            </StyledButton>
//            <StyledButton
//              color={'primary'}
//              disableElevation
//              onClick={onDialogSendEmailClick}
//              variant={'contained'}
//            >
//              Send Email
//            </StyledButton>
//          </>
//        }
//        onClose={close}
//        open={visible}
//      ></StyledDialog>
//    </Box>
//  );
//});
