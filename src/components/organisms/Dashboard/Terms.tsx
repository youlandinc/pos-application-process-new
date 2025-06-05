import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Collapse, Fade, Icon, Stack, Typography } from '@mui/material';
import { CloseOutlined, KeyboardArrowUp } from '@mui/icons-material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  useBreakpoints,
  useGoogleStreetViewAndMap,
  useRenderPdf,
  useSessionStorageState,
  useSwitch,
} from '@/hooks';

import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PREPAYMENT_PENALTY,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
  AUTO_HIDE_DURATION,
} from '@/constants';

import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
  POSGetParamsFromUrl,
} from '@/utils';

import {
  StyledButton,
  StyledDialog,
  StyledLoading,
  StyledTooltip,
} from '@/components/atoms';

import {
  AdditionalFee,
  AddressData,
  HttpError,
  LoanAnswerEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPurposeEnum,
  LoanSnapshotEnum,
  UserType,
} from '@/types';
import { _fetchLoanTermsData, _resubmitLoan } from '@/requests/dashboard';
import { _downloadFile, _fetchFile } from '@/requests/application';

import NOTIFICATION_INFO from '@/components/atoms/StyledNotification/notification_info.svg';
import ICON_LOCKED from './assets/icon-locked.svg';

export const Terms: FC = observer(() => {
  const router = useRouter();

  const breakpoints = useBreakpoints();

  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

  const { saasState } = useSessionStorageState('tenantConfig');

  const [data, setData] = useState<any>({});
  const [modifying, setModifying] = useState(false);

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const { data } = await _fetchLoanTermsData(loanId);
      setData(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [location?.href]);

  const {
    open: modifyOpen,
    close: modifyClose,
    visible: modifyVisible,
  } = useSwitch(false);

  const {
    open: previewOpen,
    close: previewClose,
    visible: previewVisible,
  } = useSwitch(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [hasBorrowerName, setHasBorrowerName] = useState<boolean>(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  const { relocate, reset: resetMap } = useGoogleStreetViewAndMap(
    data?.propertyAddress?.lat,
    data?.propertyAddress?.lng,
    mapRef,
    panoramaRef,
  );

  useEffect(
    () => {
      if (data?.propertyAddress?.lng || data?.propertyAddress?.lat) {
        return;
      }
      relocate(data?.propertyAddress?.lat, data?.propertyAddress?.lng);
      return () => {
        resetMap();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.propertyAddress?.lat, data?.propertyAddress?.lng, relocate],
  );

  useEffect(() => {
    relocate(data?.propertyAddress?.lat, data?.propertyAddress?.lng);
    return () => {
      resetMap();
    };
  }, [
    data?.propertyAddress?.lat,
    data?.propertyAddress?.lng,
    relocate,
    resetMap,
  ]);

  const getPDF = useCallback(
    async (fileType: 'letter' | 'summary') => {
      if (!router.query.loanId) {
        return;
      }
      setViewLoading(true);
      try {
        const {
          data: { letterHtml, hasBorrowerName },
        } = await _fetchFile(router.query.loanId as string, fileType);
        setHasBorrowerName(hasBorrowerName);
        previewOpen();
        setTimeout(() => {
          renderFile(letterHtml);
        }, 100);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setViewLoading(false);
      }
    },
    [router?.query?.loanId, enqueueSnackbar, previewOpen, renderFile],
  );

  const renderLoanAmount = useMemo(() => {
    switch (data?.productCategory) {
      case LoanProductCategoryEnum.stabilized_bridge:
        if (data?.loanPurpose === LoanPurposeEnum.purchase) {
          return (
            <>
              <LoanTermCardRow
                content={POSFormatDollar(data?.purchasePrice)}
                title={'Purchase price'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.purchaseLoanAmount)}
                title={'Purchase loan amount'}
              />
              <LoanTermCardRow
                content={POSFormatPercent(
                  data?.ltv,
                  POSGetDecimalPlaces(data?.ltv),
                )}
                title={'Loan to value'}
              />
            </>
          );
        }
        return (
          <>
            <LoanTermCardRow
              content={POSFormatDollar(data?.propertyValue)}
              title={'As-is property value'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.refinanceLoanAmount)}
              title={'Refinance loan amount'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.payoffAmount)}
              title={'Payoff amount'}
            />
            <LoanTermCardRow
              content={POSFormatPercent(
                data?.ltv,
                POSGetDecimalPlaces(data?.ltv),
              )}
              title={'Loan to value'}
            />
          </>
        );
      case LoanProductCategoryEnum.fix_and_flip:
        if (data?.loanPurpose === LoanPurposeEnum.purchase) {
          return (
            <>
              <LoanTermCardRow
                content={POSFormatDollar(data?.purchasePrice)}
                title={'Purchase price'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.purchaseLoanAmount)}
                title={'Purchase loan amount'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.rehabCost)}
                title={'Est. cost of rehab'}
              />
              <LoanTermCardRow
                content={POSFormatPercent(
                  data?.ltc,
                  POSGetDecimalPlaces(data?.ltc),
                )}
                title={'Loan to cost'}
              />
              <LoanTermCardRow
                content={POSFormatPercent(
                  data?.arLtv,
                  POSGetDecimalPlaces(data?.arLtv),
                )}
                title={'After-repair loan to value'}
              />
            </>
          );
        }
        return (
          <>
            {data?.propertyOwned === LoanAnswerEnum.no ? (
              <LoanTermCardRow
                content={POSFormatDollar(data?.purchasePrice)}
                title={'Purchase price'}
              />
            ) : (
              <LoanTermCardRow
                content={POSFormatDollar(data?.propertyValue)}
                title={'As-is property value'}
              />
            )}
            <LoanTermCardRow
              content={POSFormatDollar(data?.improvementsSinceAcquisition)}
              title={'Improvements since acquisition'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.refinanceLoanAmount)}
              title={'Refinance loan amount'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.payoffAmount)}
              title={'Payoff amount'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.rehabCost)}
              title={'Est. cost of rehab'}
            />
            <LoanTermCardRow
              content={POSFormatPercent(
                data?.ltc,
                POSGetDecimalPlaces(data?.ltc),
              )}
              title={'Loan to cost'}
            />
            <LoanTermCardRow
              content={POSFormatPercent(
                data?.arLtv,
                POSGetDecimalPlaces(data?.arLtv),
              )}
              title={'After-repair loan to value'}
            />
          </>
        );
      case LoanProductCategoryEnum.ground_up_construction:
        if (data?.loanPurpose === LoanPurposeEnum.purchase) {
          return (
            <>
              <LoanTermCardRow
                content={POSFormatDollar(data?.initialDisbursement)}
                title={'Initial disbursement'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.futureConstructionFunding)}
                title={'Future construction funding'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.arv)}
                title={'Completed/After-repair value (ARV)'}
              />
              <LoanTermCardRow
                content={POSFormatPercent(
                  data?.ltc,
                  POSGetDecimalPlaces(data?.ltc),
                )}
                title={'Loan to total cost'}
              />
              <LoanTermCardRow
                content={POSFormatPercent(
                  data?.arLtv,
                  POSGetDecimalPlaces(data?.arLtv),
                )}
                title={'Completed/After repair LTV'}
              />
            </>
          );
        }
        return (
          <>
            <LoanTermCardRow
              content={POSFormatDollar(data?.initialDisbursement)}
              title={'Initial disbursement'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.futureConstructionFunding)}
              title={'Future construction funding'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.arv)}
              title={'Completed/After-repair value (ARV)'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.improvementsSinceAcquisition)}
              title={'Improvements since purchase'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.payoffAmount)}
              title={'Payoff amount'}
            />
            <LoanTermCardRow
              content={POSFormatPercent(
                data?.ltc,
                POSGetDecimalPlaces(data?.ltc),
              )}
              title={'Loan to total cost'}
            />
            <LoanTermCardRow
              content={POSFormatPercent(
                data?.arLtv,
                POSGetDecimalPlaces(data?.arLtv),
              )}
              title={'Completed/After repair LTV'}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    data?.arLtv,
    data?.arv,
    data?.futureConstructionFunding,
    data?.improvementsSinceAcquisition,
    data?.initialDisbursement,
    data?.loanPurpose,
    data?.ltc,
    data?.ltv,
    data?.payoffAmount,
    data?.productCategory,
    data?.propertyOwned,
    data?.propertyValue,
    data?.purchaseLoanAmount,
    data?.purchasePrice,
    data?.refinanceLoanAmount,
    data?.rehabCost,
  ]);

  const renderCompensationFee = useMemo(() => {
    switch (userType) {
      case UserType.CUSTOMER:
        return null;
      case UserType.BROKER:
        return (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            gap={{ xs: 1.5, lg: 3 }}
            p={{ xs: 1.5, lg: 3 }}
            width={'100%'}
          >
            <LoanTermCardRow
              content={POSFormatDollar(data?.compensationFee)}
              isHeader={true}
              title={'Total broker compensation'}
            />
            <LoanTermCardRow
              content={`${POSFormatDollar(
                data?.originationFee,
              )} (${POSFormatPercent(
                data?.originationPoints,
                POSGetDecimalPlaces(data?.originationPoints),
              )})`}
              title={'Broker origination fee'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.processingFee)}
              title={'Broker processing fee'}
            />
            {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
              <LoanTermCardRow
                content={POSFormatDollar(fee.value)}
                key={`broker_additional_fee_${index}`}
                title={fee.fieldName}
              />
            ))}
          </Stack>
        );
      case UserType.LOAN_OFFICER:
        return (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            gap={{ xs: 1.5, lg: 3 }}
            p={{ xs: 1.5, lg: 3 }}
            width={'100%'}
          >
            <LoanTermCardRow
              content={POSFormatDollar(data?.compensationFee)}
              isHeader={true}
              title={'Total loan officer compensation'}
            />
            <LoanTermCardRow
              content={`${POSFormatDollar(
                data?.originationFee,
              )} (${POSFormatPercent(
                data?.originationPoints,
                POSGetDecimalPlaces(data?.originationPoints),
              )})`}
              title={'Loan officer origination fee'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.processingFee)}
              title={'Loan officer processing fee'}
            />
            {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
              <LoanTermCardRow
                content={POSFormatDollar(fee.value)}
                key={`officer_additional_fee_${index}`}
                title={fee.fieldName}
              />
            ))}
          </Stack>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            gap={{ xs: 1.5, lg: 3 }}
            p={{ xs: 1.5, lg: 3 }}
            width={'100%'}
          >
            <LoanTermCardRow
              content={POSFormatDollar(data?.compensationFee)}
              isHeader={true}
              title={'Total agent compensation'}
            />
            <LoanTermCardRow
              content={POSFormatDollar(data?.processingFee)}
              title={'Referral fee'}
            />
            {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
              <LoanTermCardRow
                content={POSFormatDollar(fee.value)}
                key={`agent_additional_fee_${index}`}
                title={fee.fieldName}
              />
            ))}
          </Stack>
        );
      default:
        return null;
    }
  }, [
    data?.additionalFees,
    data?.compensationFee,
    data?.originationFee,
    data?.originationPoints,
    data?.processingFee,
    userType,
  ]);

  const handleDownload = useCallback(async () => {
    const handler = (data: any, fileName?: string) => {
      // file export
      if (!data) {
        return;
      }
      const fileUrl = window.URL.createObjectURL(
        new Blob([data], { type: 'application/octet-stream' }),
      );
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = fileName || 'Pre-approval-letter.pdf';
      a.href = fileUrl;
      a.click();
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    };

    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    setDownloadLoading(true);
    try {
      const res = await _downloadFile(loanId);
      handler(res.data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setDownloadLoading(false);
    }
  }, [enqueueSnackbar]);

  const onClickToModify = useCallback(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    const postData = {
      loanId,
      nextSnapshot: LoanSnapshotEnum.starting_question,
    };
    setModifying(true);

    try {
      await _resubmitLoan(postData);
      router.push({
        pathname: '/',
        query: {
          loanId,
        },
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
      setModifying(false);
    }
  }, [enqueueSnackbar, router]);

  const renderConditionRatesAndPayment = useMemo(() => {
    const shouldRender =
      data?.loanTerm > 0 && data?.interestRate > 0 && data?.monthlyPayment > 0;
    const renderNodes = () => (
      <>
        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          gap={{ xs: 1.5, lg: 3 }}
          p={{ xs: 1.5, lg: 3 }}
          width={'100%'}
        >
          <LoanTermCardRow
            content={POSFormatPercent(
              data?.interestRate,
              POSGetDecimalPlaces(data?.interestRate),
            )}
            isHeader={true}
            title={'Interest rate'}
          />
          <LoanTermCardRow
            content={`${data?.loanTerm} months`}
            title={'Term'}
          />
        </Stack>
        <Stack
          border={'1px solid #D2D6E1'}
          borderRadius={2}
          gap={{ xs: 1.5, lg: 3 }}
          p={{ xs: 1.5, lg: 3 }}
          width={'100%'}
        >
          <LoanTermCardRow
            content={POSFormatDollar(data?.monthlyPayment, 2)}
            isHeader={true}
            title={
              data?.productCategory ===
              LoanProductCategoryEnum.ground_up_construction
                ? 'Initial monthly payment'
                : 'Monthly payment'
            }
          />
          {data?.productCategory ===
            LoanProductCategoryEnum.ground_up_construction && (
            <LoanTermCardRow
              content={POSFormatDollar(data?.fullDrawnMonthlyPayment)}
              title={'Full monthly payment'}
            />
          )}
        </Stack>
      </>
    );

    if (!saasState?.posSettings?.usePricingEngine) {
      if (
        data?.productCategory !== LoanProductCategoryEnum.dscr_rental ||
        data?.propertyType !== LoanPropertyTypeEnum.multifamily
      ) {
        return shouldRender ? renderNodes() : null;
      }
      return shouldRender ? renderNodes() : null;
    }

    if (
      data?.productCategory === LoanProductCategoryEnum.dscr_rental ||
      data?.propertyType === LoanPropertyTypeEnum.multifamily
    ) {
      return shouldRender ? renderNodes() : null;
    }

    return renderNodes();
  }, [
    data?.loanTerm,
    data?.interestRate,
    data?.monthlyPayment,
    data?.productCategory,
    data?.propertyType,
    data?.fullDrawnMonthlyPayment,
    saasState?.posSettings?.usePricingEngine,
  ]);

  const preApprovedCondition = useMemo(() => {
    if (data?.productCategory === LoanProductCategoryEnum.dscr_rental) {
      if (!data?.loanTerm || !data?.interestRate) {
        return false;
      }
      return data?.propertyType !== LoanPropertyTypeEnum.multifamily;
    }

    return (
      data?.productCategory !== LoanProductCategoryEnum.dscr_rental &&
      data?.propertyType !== LoanPropertyTypeEnum.multifamily
    );
  }, [
    data?.interestRate,
    data?.loanTerm,
    data?.productCategory,
    data?.propertyType,
  ]);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 194px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack>
        <Stack
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={3}
          width={'100%'}
        >
          <Stack flex={1} gap={3}>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanTermCardRow
                content={POSFormatDollar(data?.totalLoanAmount)}
                isHeader={true}
                title={'Total loan amount'}
              />
              {renderLoanAmount}
            </Stack>

            {renderConditionRatesAndPayment}

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanTermCardRow
                content={POSFormatDollar(data?.closingCash)}
                isHeader={true}
                title={'Cash required at closing'}
              />
              {data?.productCategory ===
                LoanProductCategoryEnum.ground_up_construction &&
                data?.loanPurpose === LoanPurposeEnum.purchase && (
                  <LoanTermCardRow
                    content={POSFormatDollar(
                      data?.purchaseConstructionCosts +
                        data?.purchasePrice -
                        data?.totalLoanAmount,
                    )}
                    title={'Down payment'}
                  />
                )}
              <LoanTermCardRow
                content={`${POSFormatDollar(
                  data?.lenderOriginationFee,
                )} (${POSFormatPercent(
                  data?.lenderOriginationPoints,
                  POSGetDecimalPlaces(data?.lenderOriginationPoints),
                )})`}
                title={'Lender origination fee'}
              />
              {data?.lenderProcessingFee !== null && (
                <LoanTermCardRow
                  content={POSFormatDollar(data?.lenderProcessingFee)}
                  title={'Lender processing fee'}
                />
              )}
              <LoanTermCardRow
                content={POSFormatDollar(data?.documentPreparationFee)}
                title={'Document preparation fee'}
              />
              <LoanTermCardRow
                content={data?.thirdPartyCosts}
                title={'Third-party costs'}
              />
              <LoanTermCardRow
                content={POSFormatDollar(data?.underwritingFee)}
                title={'Underwriting fee'}
              />
              {data?.wireFee !== null && (
                <LoanTermCardRow
                  content={POSFormatDollar(data?.wireFee)}
                  title={'Wire fee'}
                />
              )}
              {/*<LoanTermCardRow*/}
              {/*  content={data?.proRatedInterest}*/}
              {/*  title={'Pro-rated interest'}*/}
              {/*/>*/}
            </Stack>

            {renderCompensationFee}

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              onClick={(e) => {
                e.preventDefault();
                if (!collapsed) {
                  setCollapsed(true);
                }
              }}
              px={{ xs: 1.5, lg: 3 }}
              sx={{
                cursor: collapsed ? 'unset' : 'pointer',
              }}
              width={'100%'}
            >
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                gap={{ xs: 1.5, lg: 3 }}
                justifyContent={'space-between'}
                onClick={(e) => {
                  e.preventDefault();
                  setCollapsed(!collapsed);
                }}
                py={{ xs: 1.5, lg: 3 }}
                sx={{ cursor: 'pointer' }}
                width={'100%'}
              >
                <Typography
                  color={'primary'}
                  variant={
                    ['xs', 'sm', 'md'].includes(breakpoints)
                      ? 'subtitle2'
                      : 'h7'
                  }
                >
                  Additional details
                </Typography>
                <KeyboardArrowUp
                  color={'primary'}
                  sx={{
                    transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform .3s',
                  }}
                />
              </Stack>

              <Collapse in={collapsed}>
                <Stack gap={{ xs: 1.5, lg: 3 }} mb={{ xs: 1.5, lg: 3 }}>
                  <LoanTermCardRow
                    content={
                      POSFindLabel(
                        APPLICATION_PREPAYMENT_PENALTY,
                        data?.prepaymentPenalty,
                      ) || data?.prepaymentPenalty
                    }
                    title={'Prepayment penalty'}
                  />
                  <LoanTermCardRow
                    content={data?.lien || '1st'}
                    title={'Lien'}
                  />
                  <LoanTermCardRow
                    content={POSFindLabel(
                      APPLICATION_LOAN_CATEGORY,
                      data?.productCategory,
                    )}
                    title={'Loan type'}
                  />
                  <LoanTermCardRow
                    content={POSFindLabel(
                      APPLICATION_LOAN_PURPOSE,
                      data?.loanPurpose,
                    )}
                    title={'Purpose'}
                  />
                  <LoanTermCardRow
                    content={
                      data?.propertyType ===
                      LoanPropertyTypeEnum.two_to_four_family
                        ? POSFindLabel(
                            APPLICATION_PROPERTY_UNIT,
                            data?.propertyUnit,
                          )
                        : POSFindLabel(
                            APPLICATION_PROPERTY_TYPE,
                            data?.propertyType,
                          )
                    }
                    title={'Property type'}
                  />
                  <LoanTermCardRow
                    content={data?.occupancy}
                    title={'Occupancy'}
                  />
                </Stack>
              </Collapse>
            </Stack>
          </Stack>

          <Stack flex={1} gap={3}>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <Box
                borderRadius={1}
                display={'none'}
                height={240}
                id={'map2'}
                ref={panoramaRef}
                width={'100%'}
              />
              <Box
                borderRadius={1}
                height={240}
                id={'map'}
                ref={mapRef}
                width={'100%'}
              />
              <Stack gap={1}>
                <Typography
                  color={'primary.brightness'}
                  mt={{ xs: 1.5, lg: 0 }}
                  variant={'subtitle1'}
                >
                  {data?.additionalAddress?.length > 0
                    ? 'Multiple addresses'
                    : 'Address'}
                </Typography>
                <Typography
                  color={'primary.darker'}
                  variant={
                    ['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h5'
                  }
                >
                  {/*{`${*/}
                  {/*  data?.propertyAddress?.address*/}
                  {/*    ? `${data?.propertyAddress?.address} `*/}
                  {/*    : ''*/}
                  {/*}${*/}
                  {/*  data?.propertyAddress?.aptNumber*/}
                  {/*    ? `${data?.propertyAddress?.aptNumber}, `*/}
                  {/*    : ''*/}
                  {/*}${*/}
                  {/*  data?.propertyAddress?.city*/}
                  {/*    ? `${data?.propertyAddress?.city}, `*/}
                  {/*    : ''*/}
                  {/*}${*/}
                  {/*  data?.propertyAddress?.state*/}
                  {/*    ? `${data?.propertyAddress?.state} `*/}
                  {/*    : ''*/}
                  {/*}${*/}
                  {/*  data?.propertyAddress?.postcode*/}
                  {/*    ? `${data?.propertyAddress?.postcode}`*/}
                  {/*    : ''*/}
                  {/*}`}*/}
                  {[
                    data.propertyAddress?.address,
                    data.propertyAddress?.aptNumber &&
                      `${data.propertyAddress?.aptNumber},`,
                    data.propertyAddress?.city &&
                      `${data.propertyAddress?.city},`,
                    data.propertyAddress?.state,
                    data.propertyAddress?.postcode,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                </Typography>
                {data?.additionalAddress?.length > 0 &&
                  (data.additionalAddress as AddressData[])?.map(
                    (item, index: number) => (
                      <Typography
                        color={'primary.darker'}
                        key={`additional_address_${index}`}
                        variant={
                          ['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h5'
                        }
                      >
                        {[
                          item?.address,
                          item?.aptNumber && `${item?.aptNumber},`,
                          item?.city && `${item?.city},`,
                          item?.state,
                          item?.postcode,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </Typography>
                    ),
                  )}
              </Stack>
              {preApprovedCondition && (
                <StyledButton
                  color={'info'}
                  disabled={viewLoading || data?.isCustom}
                  loading={viewLoading}
                  onClick={() => getPDF('letter')}
                  variant={'outlined'}
                >
                  View pre-approval letter
                </StyledButton>
              )}

              {data?.isCustom && (
                <Typography color={'text.secondary'} variant={'body3'}>
                  When using a custom loan amount, the pre-approval letter is
                  only available after the loan has passed preliminary
                  underwriting.
                </Typography>
              )}
            </Stack>

            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              px={{ xs: 0.75, lg: 1.5 }}
            >
              <b>Disclaimer: </b>The estimates are subject to change and do not
              include 3rd party settlement fees required to close your loan.
            </Typography>

            {data?.isLocked ? (
              <Stack alignItems={{ xs: 'unset', lg: 'flex-end' }}>
                <StyledTooltip
                  mode={'controlled'}
                  title={
                    'The underwriter has locked this loan. Please contact them for any changes you want to make.'
                  }
                  tooltipSx={{ width: 166 }}
                >
                  <Stack
                    alignItems={'center'}
                    bgcolor={'#F5F5F5'}
                    borderRadius={2}
                    color={'#BABCBE'}
                    flexDirection={'row'}
                    gap={0.5}
                    height={40}
                    justifyContent={'center'}
                    sx={{ cursor: 'default' }}
                    width={166}
                  >
                    Details locked
                    <Icon
                      component={ICON_LOCKED}
                      sx={{ height: 16, width: 16 }}
                    />
                  </Stack>
                </StyledTooltip>
              </Stack>
            ) : (
              <Typography
                color={'primary.main'}
                onClick={modifyOpen}
                sx={{
                  mt: 3,
                  ml: { xs: 0, lg: 'auto' },
                  cursor: 'pointer',
                  py: 0.75,
                  px: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'primary.lighter' },
                }}
              >
                Modify application
              </Typography>
            )}
          </Stack>
        </Stack>

        <StyledDialog
          content={
            <Typography
              color={'text.secondary'}
              pb={4}
              pt={1.5}
              variant={'body2'}
              width={'100%'}
            >
              You will have to resubmit the application and go through
              underwriting again.
            </Typography>
          }
          footer={
            <Stack flexDirection={'row'} gap={3}>
              <StyledButton
                color={'info'}
                onClick={modifyClose}
                size={'small'}
                sx={{ width: 120 }}
                variant={'outlined'}
              >
                No, cancel
              </StyledButton>
              <StyledButton
                color={'error'}
                disabled={modifying}
                loading={modifying}
                onClick={onClickToModify}
                size={'small'}
                sx={{ width: 120 }}
              >
                Yes, modify
              </StyledButton>
            </Stack>
          }
          header={'Are you sure you want to modify your application?'}
          onClose={modifyClose}
          open={modifyVisible}
        />

        <StyledDialog
          content={
            <Stack py={6} width={'100%'}>
              {!hasBorrowerName && (
                <Stack px={8}>
                  <Stack
                    bgcolor={'#F4F7FD'}
                    borderRadius={2}
                    boxShadow={'0 2px 2px rgba(227, 227, 227, 1)'}
                    color={'#636A7C'}
                    flexDirection={'row'}
                    fontSize={{ xs: 12, lg: 14 }}
                    fontWeight={600}
                    gap={1}
                    p={'12px 24px'}
                  >
                    <Icon
                      component={NOTIFICATION_INFO}
                      sx={{ mt: { xs: -0.5, lg: -0.25 } }}
                    />
                    To show the borrower’s name on the pre-approval letter,
                    submit the loan first, then complete the borrower info task.
                  </Stack>
                </Stack>
              )}
              <Box pt={3} ref={pdfFile} />
            </Stack>
          }
          disableEscapeKeyDown
          footer={
            <Stack pt={3}>
              <StyledButton
                disabled={downloadLoading}
                loading={downloadLoading}
                onClick={handleDownload}
                sx={{ width: 200 }}
              >
                Download
              </StyledButton>
            </Stack>
          }
          header={
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              pb={3}
            >
              <Typography variant={'h6'}>Pre-approval letter</Typography>
              <StyledButton isIconButton onClick={previewClose}>
                <CloseOutlined />
              </StyledButton>
            </Stack>
          }
          open={previewVisible}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: { lg: '900px !important', xs: '100% !important' },
              width: '100%',
              '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
                bgcolor: '#F5F8FA',
                p: 3,
              },
            },
          }}
        />
      </Stack>
    </Fade>
  );
});

const LoanTermCardRow: FC<{
  title: string;
  content: string;
  isHeader?: boolean;
}> = ({ title, content, isHeader = false }) => {
  const breakpoints = useBreakpoints();
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'100%'}
    >
      <Typography
        color={isHeader ? 'primary' : 'text.secondary'}
        variant={
          isHeader
            ? ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'subtitle2'
              : 'h7'
            : ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'body3'
              : 'body1'
        }
      >
        {title}
      </Typography>
      <Typography
        color={isHeader ? 'primary' : 'text.primary'}
        fontWeight={600}
        variant={
          isHeader
            ? ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'subtitle2'
              : 'h7'
            : ['xs', 'sm', 'md'].includes(breakpoints)
              ? 'body3'
              : 'body1'
        }
      >
        {content || '-'}
      </Typography>
    </Stack>
  );
};
