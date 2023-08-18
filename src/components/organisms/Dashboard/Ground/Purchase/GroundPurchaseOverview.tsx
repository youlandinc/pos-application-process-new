import { FC, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION, OPTIONS_MORTGAGE_PROPERTY } from '@/constants';
import { GPOverviewSummaryData } from '@/types';
import { _fetchOverviewLoanSummary } from '@/requests/dashboard';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSFormatPercent,
} from '@/utils';
import { useSessionStorageState } from '@/hooks';

import { StyledButton } from '@/components/atoms';
import {
  CommonOverviewInfo,
  DashboardCard,
  DashboardHeader,
} from '@/components/molecules';

export const GroundPurchaseOverview: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [summary, setSummary] = useState<CommonOverviewInfo>();
  const [product, setProduct] = useState<CommonOverviewInfo>();
  const [loanDetail, setLoanDetail] = useState<CommonOverviewInfo>();
  const [thirdParty, setThirdParty] = useState<CommonOverviewInfo>();

  const { loading } = useAsync(async () => {
    if (!router.query.processId) {
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
          subTitle: 'Total Loan Amount',
          subInfo: POSFormatDollar(summary.loanAmount),
          info: [
            {
              label: 'Purchase Price',
              info: POSFormatDollar(summary?.purchasePrice),
            },
            {
              label: 'Purchase Loan Amount',
              info: POSFormatDollar(summary?.purchaseLoanAmount),
            },
            {
              label: 'Rehab Loan Amount',
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
          subTitle: 'Interest Rate',
          subInfo: POSFormatLocalPercent(product.interestRateOfYear),
          info: [
            { label: 'Loan Term', info: `${product.loanTerm} months` },
            {
              label: 'Monthly Payment',
              info: POSFormatDollar(product.paymentOfMonth),
            },
            { label: 'Status', info: product.status },
          ],
        });
        setLoanDetail({
          title: 'Loan details',
          subTitle: 'Preferred Close Date',
          subInfo: loanDetail?.closeDate,
          info: [
            { label: 'Amortization', info: loanDetail?.amortization },
            {
              label: 'Property Type',
              info: POSFindLabel(
                OPTIONS_MORTGAGE_PROPERTY,
                loanDetail?.propertyType as string,
              ),
            },
            {
              label: 'Pre-payment Penalty',
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
              label: 'Loan to Value(LTV)',
              info: POSFormatPercent(loanDetail?.ltv),
            },
            {
              label: 'Loan to Cost(LTC)',
              info: POSFormatPercent(loanDetail?.ltc),
            },
          ],
        });
        setThirdParty({
          title: 'Est. Cash Required at Closing',
          subTitle: 'Total',
          subInfo: POSFormatDollar(thirdParty?.totalClosingCash),
          info: [
            {
              label: 'Down Payment',
              info: POSFormatDollar(thirdParty?.downPayment),
            },
            {
              label: 'Origination Fee',
              info: `${POSFormatDollar(
                thirdParty?.originationFee,
              )}(${POSFormatLocalPercent(thirdParty?.originationFeePer)})`,
            },
            {
              label: 'Underwriting Fee',
              info: POSFormatDollar(thirdParty?.underwritingFee),
            },
            {
              label: 'Document Preparation Fee',
              info: POSFormatDollar(thirdParty?.docPreparationFee),
            },
            {
              label: 'Pro-rated Interest',
              info: POSFormatDollar(thirdParty?.proRatedInterest),
            },
            { label: 'Third-party Costs', info: thirdParty?.thirdPartyCosts },
          ],
        });
      })
      .catch((err) => {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () => router.push('/pipeline'),
        });
      });
  });

  return (
    <Stack
      alignItems={'flex-start'}
      className={'container'}
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
        title={'Your Loan Overview'}
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
              View Letter
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
              Explore Rate
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
            className={'link_style'}
            component={'span'}
            onClick={() =>
              router.push({
                pathname: '/dashboard/tasks',
                query: router.query,
              })
            }
          >
            Tasks
          </Box>{' '}
          to see what you need to take care of to secure your loan.
        </Typography>
        <Typography component={'div'} mt={3} variant={'body3'}>
          <Box>Disclaimer</Box>
          <Box mt={1.25}>
            The total loan amount is an estimate, and may be subject to change.
            The amount also does not include third party settlement costs that
            may be required to close your loan. For more details on those
            potential costs, please contact your settlement agent.
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
    </Stack>
  );
});
