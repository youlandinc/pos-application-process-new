import { useMst } from '@/models/Root';
import { InfoOutlined } from '@mui/icons-material';
import { FC, ReactNode, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION, OPTIONS_MORTGAGE_PROPERTY } from '@/constants';
import {
  GPOverviewSummaryData,
  HttpError,
  ServiceTypeEnum,
  UserType,
} from '@/types';
import { _fetchOverviewLoanSummary } from '@/requests/dashboard';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSFormatPercent,
} from '@/utils';
import { useSessionStorageState } from '@/hooks';

import {
  StyledButton,
  StyledLoading,
  StyledTooltip,
  Transitions,
} from '@/components/atoms';
import {
  CommonOverviewInfo,
  DashboardCard,
  DashboardHeader,
} from '@/components/molecules';

export const GroundPurchaseOverview: FC = observer(() => {
  const router = useRouter();

  const { userType } = useMst();

  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [summary, setSummary] = useState<CommonOverviewInfo>();
  const [product, setProduct] = useState<CommonOverviewInfo>();
  const [loanDetail, setLoanDetail] = useState<CommonOverviewInfo>();
  const [thirdParty, setThirdParty] = useState<CommonOverviewInfo>();

  const { loading } = useAsync(async () => {
    if (!router.query.processId || !saasState?.serviceTypeEnum) {
      return;
    }
    return await _fetchOverviewLoanSummary<GPOverviewSummaryData>(
      router.query.processId as string,
    )
      .then((res) => {
        const {
          data: { summary, product, loanDetail, thirdParty },
        } = res;
        const [line_1, line_2] = summary.address.split('NEW_LINE');
        setSummary({
          title: 'Purchase',
          subTitle: 'Total loan amount',
          subInfo: POSFormatDollar(summary.loanAmount),
          info: [
            {
              label: 'Purchase price',
              info: POSFormatDollar(summary?.purchasePrice),
            },
            {
              label: 'Purchase loan amount',
              info: POSFormatDollar(summary?.purchaseLoanAmount),
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
                    sx={{
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
          title: 'Rate',
          subTitle: 'Interest rate',
          subInfo: POSFormatLocalPercent(product.interestRateOfYear),
          info: [
            { label: 'Loan term', info: `${product.loanTerm} months` },
            {
              label: 'Monthly payment',
              info: POSFormatDollar(product.paymentOfMonth),
            },
            { label: 'Status', info: product.status },
          ],
        });
        setLoanDetail({
          title: 'Loan details',
          subTitle: 'Preferred close date',
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
                ? POSFormatDollar(loanDetail?.penalty)
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
          label: string | ReactNode;
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
              label: (
                <Stack
                  alignItems={'center'}
                  flexDirection={'row'}
                  gap={0.5}
                  sx={{ fontSize: 'inherit' }}
                >
                  Broker origination fee{' '}
                  <StyledTooltip
                    title={`This is a charge associated with the professional services rendered by the broker in facilitating your loan application and processing. If you have any questions or concerns, please email us at ${saasState?.posSettings?.email}.`}
                  >
                    <InfoOutlined
                      sx={{
                        width: 14,
                        height: 14,
                        mb: 0.125,
                        color: 'info.main',
                      }}
                    />
                  </StyledTooltip>
                </Stack>
              ),
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
              label: 'Down payment',
              info: POSFormatDollar(thirdParty?.downPayment),
            },
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
      {loading ? (
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
              'Everything about your loan found in one place. Get updates and see what needs to be done before you close.'
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
                <StyledButton
                  color={'primary'}
                  onClick={async () =>
                    await router.push({
                      pathname: '/dashboard/pre_approval_letter',
                      query: router.query,
                    })
                  }
                  variant={'contained'}
                >
                  View letter
                </StyledButton>
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
                  Explore rate
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
              to see what you need to take care of to secure your loan.
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
                Rates displayed are subject to rate lock and are not to be
                considered an extension or offer of credit by
                {
                  // todo: sass
                  ' ' + saasState?.organizationName || ' YouLand'
                }
                .
              </Box>
            </Typography>
          </Box>
        </Box>
      )}
    </Transitions>
  );
});
