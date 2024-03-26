import { FC, useCallback, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, OPTIONS_MORTGAGE_PROPERTY } from '@/constants';
import { useRenderPdf, useSessionStorageState, useSwitch } from '@/hooks';
import {
  _fetchOverviewLoanSummary,
  _previewPreApprovalPDFFile,
  _sendPreapprovalLetter,
} from '@/requests/dashboard';
import {
  GROverviewSummaryData,
  HttpError,
  ServiceTypeEnum,
  UserType,
} from '@/types';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSFormatPercent,
  POSGetParamsFromUrl,
} from '@/utils';

import {
  StyledBadge,
  StyledButton,
  StyledDialog,
  StyledLoading,
  StyledTextField,
  Transitions,
} from '@/components/atoms';
import {
  CommonOverviewInfo,
  DashboardCard,
  DashboardHeader,
} from '@/components/molecules';
import { CloseOutlined, ForwardToInboxOutlined } from '@mui/icons-material';

export const GroundRefinanceOverview: FC = observer(() => {
  const router = useRouter();

  const {
    userType,
    selectedProcessData: { loanStage },
  } = useMst();

  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  // const tenantConfig = utils.getTenantConfig();

  const [summary, setSummary] = useState<CommonOverviewInfo>();
  const [product, setProduct] = useState<CommonOverviewInfo>();
  const [loanDetail, setLoanDetail] = useState<CommonOverviewInfo>();
  const [thirdParty, setThirdParty] = useState<CommonOverviewInfo>();

  const {
    open: previewOpen,
    close: previewClose,
    visible: previewVisible,
  } = useSwitch(false);
  const {
    open: sendOpen,
    close: sendClose,
    visible: sendVisible,
  } = useSwitch(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const onViewPDF = useCallback(async () => {
    setViewLoading(true);
    try {
      const { data } = await _previewPreApprovalPDFFile(
        router?.query?.processId as string,
      );
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
  }, [router?.query?.processId, previewOpen, renderFile, enqueueSnackbar]);

  const onEmailSubmit = useCallback(async () => {
    setSendLoading(true);
    try {
      await _sendPreapprovalLetter(router.query.processId as string, email);
      enqueueSnackbar('Email was successfully sent', {
        variant: 'success',
      });
      sendClose();
      setEmail('');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSendLoading(false);
    }
  }, [router.query.processId, email, enqueueSnackbar, sendClose]);

  const { loading } = useAsync(async () => {
    const { processId } = POSGetParamsFromUrl(location.href);
    return await _fetchOverviewLoanSummary<GROverviewSummaryData>(processId)
      .then((res) => {
        const {
          data: { summary, product, loanDetail, thirdParty },
        } = res;
        const [line_1, line_2] = summary.address.split('NEW_LINE');
        setSummary({
          title: 'Refinance',
          subTitle: 'Total loan amount',
          subInfo: POSFormatDollar(summary.loanAmount),
          info: [
            {
              label: 'Payoff amount',
              info: POSFormatDollar(summary.balance),
            },
            {
              label: 'Cash out amount',
              info: POSFormatDollar(summary.cashOutAmount),
            },
            {
              label: 'Rehab loan amount',
              info: summary?.cor ? POSFormatDollar(summary.cor) : 'N/A',
            },
            {
              label: 'Borrower',
              info: `${summary.firstName} ${summary.lastName}`,
            },
            {
              label: 'Address',
              info: (
                <Stack
                  alignItems={'flex-end'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  width={'100%'}
                >
                  <Box
                    style={{
                      wordBreak: 'break-all',
                      whiteSpace: 'break-spaces',
                      lineHeight: 1.5,
                    }}
                  >
                    {line_1}
                  </Box>
                  <Box>{line_2}</Box>
                </Stack>
              ),
            },
          ],
        });
        setProduct({
          title: 'Loan terms',
          subTitle: 'Interest rate',
          subInfo: POSFormatLocalPercent(product.interestRateOfYear),
          info: [
            {
              label: 'Loan duration',
              info: `${product.loanTerm} months`,
            },
            {
              label: 'Monthly payment',
              info: POSFormatDollar(product.paymentOfMonth),
            },
            { label: 'Status', info: product.status },
          ],
        });
        setLoanDetail({
          title: 'Loan details',
          subTitle: 'Preferred closing date',
          subInfo: loanDetail?.closeDate,
          info: [
            { label: 'Amortization', info: loanDetail?.amortization },
            {
              label: 'Property type',
              info: POSFindLabel(
                OPTIONS_MORTGAGE_PROPERTY,
                loanDetail?.propertyType as string,
              ),
            },
            {
              label: 'Pre-payment penalty',
              info: loanDetail?.penalty
                ? POSFormatDollar(loanDetail.penalty)
                : 'N/A',
            },
            { label: 'Lien', info: loanDetail?.lien },
            {
              label: 'Estimated ARV',
              info: loanDetail?.arv ? POSFormatDollar(loanDetail?.arv) : 'N/A',
            },
            {
              label: 'Loan to value(LTV)',
              info: POSFormatPercent(loanDetail?.ltv),
            },
            {
              label: 'Loan to cost(LTC)',
              info: POSFormatPercent(loanDetail?.ltc),
            },
          ],
        });
        let temp: {
          label: string;
          info: string;
        }[];
        switch (userType) {
          case UserType.BROKER: {
            temp = [
              {
                label: 'Broker origination fee',
                info: `${POSFormatDollar(
                  thirdParty?.brokerOriginationFee,
                )}(${POSFormatPercent(
                  (thirdParty?.brokerPoints as number) / 100,
                )})`,
              },
              {
                label: 'Broker processing fee',
                info: POSFormatDollar(thirdParty?.brokerProcessingFee),
              },
            ];
            break;
          }
          case UserType.LENDER: {
            temp = [
              {
                label: 'Lender origination fee',
                info: `${POSFormatDollar(
                  thirdParty?.lenderOriginationFee,
                )}(${POSFormatPercent(
                  (thirdParty?.lenderPoints as number) / 100,
                )})`,
              },
              {
                label: 'Lender processing fee',
                info: POSFormatDollar(thirdParty?.lenderProcessingFee),
              },
            ];
            break;
          }
          case UserType.LOAN_OFFICER: {
            temp = [
              {
                label: 'Loan officer origination fee',
                info: `${POSFormatDollar(
                  thirdParty?.officerOriginationFee,
                )}(${POSFormatPercent(
                  (thirdParty?.officerPoints as number) / 100,
                )})`,
              },
              {
                label: 'Loan officer processing fee',
                info: POSFormatDollar(thirdParty?.officerProcessingFee),
              },
            ];
            break;
          }
          case UserType.REAL_ESTATE_AGENT: {
            temp = [
              {
                label: 'Referral fee',
                info: `${POSFormatDollar(thirdParty?.agentFee)}`,
              },
            ];
            break;
          }
          case UserType.CUSTOMER: {
            temp = [];
            break;
          }
          default: {
            temp = [];
            break;
          }
        }
        if (saasState?.serviceTypeEnum === ServiceTypeEnum.WHITE_LABEL) {
          temp = [
            {
              label: 'Broker origination fee',
              info: `${POSFormatDollar(
                thirdParty?.brokerOriginationFee,
              )}(${POSFormatPercent(
                (thirdParty?.brokerPoints as number) / 100,
              )})`,
            },
            {
              label: 'Broker processing fee',
              info: POSFormatDollar(thirdParty?.brokerProcessingFee),
            },
          ];
        }
        setThirdParty({
          title: 'Est. cash required at closing',
          subTitle: 'Total',
          subInfo: POSFormatDollar(thirdParty?.totalClosingCash),
          info: [
            {
              label: 'Origination fee',
              info: `${POSFormatDollar(
                thirdParty?.originationFee,
              )}(${POSFormatLocalPercent(thirdParty?.originationFeePer)})`,
            },
            {
              label: 'Underwriting fee',
              info: POSFormatDollar(thirdParty?.underwritingFee),
            },
            {
              label: 'Document preparation fee',
              info: POSFormatDollar(thirdParty?.docPreparationFee),
            },
            {
              label: 'Pro-rated interest',
              info: POSFormatDollar(thirdParty?.proRatedInterest),
            },
            { label: 'Third-party costs', info: thirdParty?.thirdPartyCosts },
            ...temp,
          ],
        });
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () => router.push('/pipeline'),
        });
      });
  }, [saasState?.serviceTypeEnum]);

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {loading || !saasState?.serviceTypeEnum ? (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          margin={'auto 0'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      ) : (
        <Box
          alignItems={'flex-start'}
          component={'div'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          maxWidth={900}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ xl: 0, lg: 3, xs: 0 }}
          width={'100%'}
        >
          <DashboardHeader
            subTitle={
              <>
                Everything about your loan found in one place. Get updates and
                see what needs to be done before you close.
                <Stack alignItems={'center'} justifyContent={'center'} mt={1.5}>
                  <StyledBadge content={loanStage} status={loanStage} />
                </Stack>
              </>
            }
            title={'Your loan overview'}
          />
          <Stack
            alignItems={'flex-start'}
            flexDirection={'column'}
            gap={3}
            justifyContent={'flex-start'}
            width={'100%'}
          >
            <Stack
              flex={1}
              flexDirection={{ xl: 'row', xs: 'column' }}
              gap={3}
              minHeight={loading ? 464 : 'unset'}
              width={'100%'}
            >
              <DashboardCard
                dataList={summary?.info}
                flex={1}
                loading={loading}
                subInfo={summary?.subInfo}
                subTitle={summary?.subTitle}
                title={summary?.title}
              >
                <Stack flexDirection={'row'} gap={1.5} width={'100%'}>
                  <StyledButton
                    color={'primary'}
                    disabled={viewLoading}
                    loading={viewLoading}
                    onClick={onViewPDF}
                    sx={{ mt: 'auto', flex: 1 }}
                    variant={'contained'}
                  >
                    View pre-approval letter
                  </StyledButton>
                  <StyledButton onClick={sendOpen} variant={'outlined'}>
                    <ForwardToInboxOutlined />
                  </StyledButton>
                </Stack>
              </DashboardCard>
              <DashboardCard
                dataList={product?.info}
                flex={1}
                loading={loading}
                subInfo={product?.subInfo}
                subTitle={product?.subTitle}
                title={product?.title}
              >
                <StyledButton
                  className={'cardButton'}
                  color={'primary'}
                  onClick={async () =>
                    await router.push({
                      pathname: '/dashboard/rates',
                      query: router.query,
                    })
                  }
                  sx={{ mt: 'auto' }}
                  variant={'contained'}
                >
                  View rate options
                </StyledButton>
              </DashboardCard>
            </Stack>

            <Stack
              flex={1}
              flexDirection={{ xl: 'row', xs: 'column' }}
              gap={3}
              minHeight={loading ? 464 : 'unset'}
              width={'100%'}
            >
              <DashboardCard
                dataList={loanDetail?.info}
                flex={1}
                loading={loading}
                subInfo={loanDetail?.subInfo}
                subTitle={loanDetail?.subTitle}
                title={loanDetail?.title}
              />
              <DashboardCard
                dataList={thirdParty?.info}
                flex={1}
                loading={loading}
                subInfo={thirdParty?.subInfo}
                subTitle={thirdParty?.subTitle}
                title={thirdParty?.title}
              />
            </Stack>
          </Stack>

          <Box color={'text.secondary'} mt={6}>
            <Typography component={'div'} variant={'body2'}>
              Check out your list of{' '}
              <Box
                component={'span'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: router.query,
                  })
                }
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Tasks
              </Box>{' '}
              to see what you need to provide before closing.
            </Typography>
            <Typography component={'div'} mt={3} variant={'body3'}>
              <Box>Disclaimer</Box>
              <Box mt={1.25}>
                The total loan amount is an estimate, and may be subject to
                change. The amount also does not include third party settlement
                costs that may be required to close your loan. For more details
                on those potential costs, please contact your settlement agent.
              </Box>
              <Box mt={1.25}>
                Rates displayed are subject to change and are not to be
                considered an extension or offer of credit by
                {' ' + saasState?.organizationName || ' YouLand'}.
              </Box>
            </Typography>
          </Box>
        </Box>
      )}

      <StyledDialog
        content={
          <Stack py={3}>
            <StyledTextField
              label={'Email address'}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={'Email address'}
              value={email}
            />
          </Stack>
        }
        disableEscapeKeyDown
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              onClick={() => {
                sendClose();
                setEmail('');
              }}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              disabled={!email || sendLoading}
              loading={sendLoading}
              onClick={onEmailSubmit}
              size={'small'}
              sx={{ width: 128 }}
            >
              Send email
            </StyledButton>
          </Stack>
        }
        header={'Who should we send the pre-approval letter to?'}
        open={sendVisible}
      />

      <StyledDialog
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={3}
          >
            <Typography variant={'h6'}>Pre-approval Letter</Typography>
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
    </Transitions>
  );
});
