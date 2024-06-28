import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { CloseOutlined, KeyboardArrowUp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  useBreakpoints,
  useGoogleStreetViewAndMap,
  useRenderPdf,
  useSwitch,
} from '@/hooks';

import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatPercent,
  POSGetDecimalPlaces,
  POSGetParamsFromUrl,
} from '@/utils';
import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
  AUTO_HIDE_DURATION,
} from '@/constants';

import { StyledButton, StyledDialog, StyledFormItem } from '@/components/atoms';

import {
  AdditionalFee,
  HttpError,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPurposeEnum,
  UserType,
} from '@/types';
import { _downloadFile, _fetchFile } from '@/requests/application';

export const LoanSummary: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep, data }) => {
    const { applicationForm, userType } = useMst();
    const { enqueueSnackbar } = useSnackbar();
    const breakpoints = useBreakpoints();

    const {
      open: previewOpen,
      close: previewClose,
      visible: previewVisible,
    } = useSwitch(false);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [viewLoading, setViewLoading] = useState<boolean>(false);

    const pdfFile = useRef(null);
    const { renderFile } = useRenderPdf(pdfFile);
    const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<HTMLDivElement>(null);

    const { relocate, reset: resetMap } = useGoogleStreetViewAndMap(
      data.propertyAddress?.lat,
      data.propertyAddress?.lng,
      mapRef,
      panoramaRef,
    );

    useEffect(
      () => {
        if (data.propertyAddress?.lng || data.propertyAddress?.lat) {
          return;
        }
        relocate(data.propertyAddress?.lat, data.propertyAddress?.lng);
        return () => {
          resetMap();
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data.propertyAddress?.lat, data.propertyAddress?.lng, relocate],
    );

    useEffect(() => {
      relocate(data.propertyAddress?.lat, data.propertyAddress?.lng);
      return () => {
        resetMap();
      };
    }, [
      data.propertyAddress?.lat,
      data.propertyAddress?.lng,
      relocate,
      resetMap,
    ]);

    const getPDF = useCallback(
      async (fileType: 'letter' | 'summary') => {
        setViewLoading(true);
        try {
          const { data } = await _fetchFile(applicationForm.loanId!, fileType);
          previewOpen();
          setTimeout(() => {
            renderFile(data);
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
      [applicationForm.loanId, enqueueSnackbar, previewOpen, renderFile],
    );

    const renderLoanAmount = useMemo(() => {
      switch (data?.productCategory) {
        case LoanProductCategoryEnum.stabilized_bridge:
          return data?.loanPurpose === LoanPurposeEnum.purchase ? (
            <>
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.purchasePrice)}
                title={'Purchase price'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.purchaseLoanAmount)}
                title={'Purchase loan amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.ltv,
                  POSGetDecimalPlaces(data?.ltv),
                )}
                title={'Loan to value'}
              />
            </>
          ) : (
            <>
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.propertyValue)}
                title={'As-is property value'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.refinanceLoanAmount)}
                title={'Refinance loan amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.payoffAmount)}
                title={'Payoff amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.ltv,
                  POSGetDecimalPlaces(data?.ltv),
                )}
                title={'Loan to value'}
              />
            </>
          );
        case LoanProductCategoryEnum.fix_and_flip:
          return data?.loanPurpose === LoanPurposeEnum.purchase ? (
            <>
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.purchasePrice)}
                title={'Purchase price'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.purchaseLoanAmount)}
                title={'Purchase loan amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.rehabCost)}
                title={'Est. cost of rehab'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.ltc,
                  POSGetDecimalPlaces(data?.ltc),
                )}
                title={'Loan to cost'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.arLtv,
                  POSGetDecimalPlaces(data?.arLtv),
                )}
                title={'After-repair loan to value'}
              />
            </>
          ) : (
            <>
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.propertyValue)}
                title={'As-is property value'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.refinanceLoanAmount)}
                title={'Refinance loan amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.payoffAmount)}
                title={'Payoff amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.rehabCost)}
                title={'Est. cost of rehab'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.ltc,
                  POSGetDecimalPlaces(data?.ltc),
                )}
                title={'Loan to cost'}
              />
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.arLtv,
                  POSGetDecimalPlaces(data?.arLtv),
                )}
                title={'After-repair loan to value'}
              />
            </>
          );
        default:
          return null;
      }
    }, [
      data?.arLtv,
      data?.loanPurpose,
      data?.ltc,
      data?.ltv,
      data?.payoffAmount,
      data?.productCategory,
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
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.compensationFee)}
                isHeader={true}
                title={'Total broker compensation'}
              />
              <LoanSummaryCardRow
                content={`${POSFormatDollar(
                  data?.originationFee,
                )} (${POSFormatPercent(
                  data?.originationPoints,
                  POSGetDecimalPlaces(data?.originationPoints),
                )})`}
                title={'Broker origination fee'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.processingFee)}
                title={'Broker processing fee'}
              />
              {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
                <LoanSummaryCardRow
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
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.compensationFee)}
                isHeader={true}
                title={'Total loan officer compensation'}
              />
              <LoanSummaryCardRow
                content={`${POSFormatDollar(
                  data?.originationFee,
                )} (${POSFormatPercent(
                  data?.originationPoints,
                  POSGetDecimalPlaces(data?.originationPoints),
                )})`}
                title={'Loan officer origination fee'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.processingFee)}
                title={'Loan officer processing fee'}
              />
              {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
                <LoanSummaryCardRow
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
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.compensationFee)}
                isHeader={true}
                title={'Total agent compensation'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.processingFee)}
                title={'Referral fee'}
              />
              {(data?.additionalFees as AdditionalFee[])?.map((fee, index) => (
                <LoanSummaryCardRow
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

    const keydownEvent = useCallback(
      (e: KeyboardEvent) => {
        const button: (HTMLElement & { disabled?: boolean }) | null =
          document.getElementById('application-loan-summary-next-button');

        if (!button) {
          return;
        }

        if (e.key === 'Enter') {
          if (!button.disabled) {
            nextStep?.();
          }
        }
      },
      [nextStep],
    );

    useEffect(() => {
      document.addEventListener('keydown', keydownEvent, false);
      return () => {
        document.removeEventListener('keydown', keydownEvent, false);
      };
    }, [keydownEvent]);

    return (
      <StyledFormItem
        gap={3}
        label={'View your loan terms'}
        labelSx={{
          fontSize: { xs: 18, lg: 24 },
        }}
        maxWidth={'auto'}
        mt={{ xs: -3, lg: 0 }}
      >
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
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.totalLoanAmount)}
                isHeader={true}
                title={'Total loan amount'}
              />
              {renderLoanAmount}
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatPercent(
                  data?.interestRate,
                  POSGetDecimalPlaces(data?.interestRate),
                )}
                isHeader={true}
                title={'Interest rate'}
              />
              <LoanSummaryCardRow
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
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.monthlyPayment, 2)}
                isHeader={true}
                title={'Monthly payment'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={{ xs: 1.5, lg: 3 }}
              p={{ xs: 1.5, lg: 3 }}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.closingCash)}
                isHeader={true}
                title={'Cash required at closing'}
              />
              <LoanSummaryCardRow
                content={`${POSFormatDollar(
                  data?.lenderOriginationFee,
                )} (${POSFormatPercent(
                  data?.lenderOriginationPoints,
                  POSGetDecimalPlaces(data?.lenderOriginationPoints),
                )})`}
                title={'Lender origination fee'}
              />
              {data?.lenderProcessingFee !== null && (
                <LoanSummaryCardRow
                  content={POSFormatDollar(data?.lenderProcessingFee)}
                  title={'Lender processing fee'}
                />
              )}
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.documentPreparationFee)}
                title={'Document preparation fee'}
              />
              <LoanSummaryCardRow
                content={data?.thirdPartyCosts}
                title={'Third-party costs'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(data?.underwritingFee)}
                title={'Underwriting fee'}
              />
              {data?.wireFee !== null && (
                <LoanSummaryCardRow
                  content={POSFormatDollar(data?.wireFee)}
                  title={'Wire fee'}
                />
              )}
              {/*<LoanSummaryCardRow*/}
              {/*  content={data?.proRatedInterest}*/}
              {/*  title={'Pro-rated interest'}*/}
              {/*/>*/}
            </Stack>

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
                  <LoanSummaryCardRow
                    content={data?.prepaymentPenalty || '0-0-0'}
                    title={'Prepayment penalty'}
                  />
                  <LoanSummaryCardRow
                    content={data?.lien || '1st'}
                    title={'Lien'}
                  />
                  <LoanSummaryCardRow
                    content={POSFindLabel(
                      APPLICATION_LOAN_CATEGORY,
                      data?.productCategory,
                    )}
                    title={'Loan type'}
                  />
                  <LoanSummaryCardRow
                    content={POSFindLabel(
                      APPLICATION_LOAN_PURPOSE,
                      data?.loanPurpose,
                    )}
                    title={'Purpose'}
                  />
                  <LoanSummaryCardRow
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
                  <LoanSummaryCardRow
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
                  Address
                </Typography>
                <Typography
                  color={'primary.darker'}
                  variant={
                    ['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h5'
                  }
                >
                  {`${
                    data.propertyAddress?.address
                      ? `${data.propertyAddress?.address}, `
                      : ''
                  }${
                    data.propertyAddress?.aptNumber
                      ? `${data.propertyAddress?.aptNumber}`
                      : ''
                  }${
                    data.propertyAddress?.city
                      ? `${data.propertyAddress?.city}, `
                      : ''
                  }${
                    data.propertyAddress?.state
                      ? `${data.propertyAddress?.state} `
                      : ''
                  }${
                    data.propertyAddress?.postcode
                      ? `${data.propertyAddress?.postcode}`
                      : ''
                  }`}
                </Typography>
              </Stack>
              <StyledButton
                color={'info'}
                disabled={viewLoading || data?.isCustom}
                loading={viewLoading}
                onClick={() => getPDF('letter')}
                variant={'outlined'}
              >
                View pre-approval letter
              </StyledButton>
              {data?.isCustom && (
                <Typography color={'text.secondary'} variant={'body3'}>
                  When using a custom loan amount, the pre-approval letter is
                  only available after the loan has passed preliminary
                  underwriting.
                </Typography>
              )}

              {/*<StyledButton color={'info'} variant={'outlined'}>*/}
              {/*  View loan summary*/}
              {/*</StyledButton>*/}
            </Stack>

            {renderCompensationFee}

            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              px={{ xs: 0.75, lg: 1.5 }}
            >
              <b>Disclaimer: </b>The estimates are subject to change and do not
              include 3rd party settlement fees required to close your loan.
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={{ xs: 3, lg: 10 }}
          mx={'auto'}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            id={'application-loan-summary-next-button'}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
          >
            Submit {!['xs', 'sm', 'md'].includes(breakpoints) && 'application'}
          </StyledButton>
        </Stack>

        <StyledDialog
          content={<Box py={6} ref={pdfFile} />}
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
      </StyledFormItem>
    );
  },
);

const LoanSummaryCardRow: FC<{
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
