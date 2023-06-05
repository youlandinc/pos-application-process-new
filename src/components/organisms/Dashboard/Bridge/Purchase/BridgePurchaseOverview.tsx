import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSFlex, POSFont } from '@/styles';
import { StyledButton } from '@/components/atoms';
import { BridgeOverviewInfo, Card, PageHeader } from '@/components/molecules';
import { _fetchOverviewLoanSummary } from '@/requests/dashboard';
import {
  POSFindLabel,
  POSFormatDollar,
  POSFormatLocalPercent,
  POSFormatPercent,
} from '@/utils';

import { BPOverviewSummaryData } from '@/types';
import { OPTIONS_MORTGAGE_PROPERTY } from '@/constants/options/mortgage';
import { AUTO_HIDE_DURATION } from '@/constants';
import { useSnackbar } from 'notistack';
import { useSessionStorageState } from '@/hooks';

const useStyles = {
  '&.container': {
    ...POSFlex('flex-start', 'center', 'column'),
    px: {
      xl: 0,
      lg: 3,
      xs: 0,
    },
    maxWidth: 900,
    mx: {
      lg: 'auto',
      xs: 0,
    },
  },
  '& .content': {
    ...POSFlex('flex-start', 'flex-start', 'column'),
    width: '100%',
  },
  '& .contentItem': {
    width: '100%',
    flex: 1,
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  '& .cardButton': {
    marginTop: 'auto',
  },
  '& .footer': {
    ...POSFont(12, 400, 1.5, 'text.secondary'),
    mt: 6,
  },
};

export const BridgePurchaseOverview: FC = observer(() => {
  const {
    userSetting: {
      setting: { lastSelectedProcessId },
    },
  } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useSessionStorageState('tenantConfig');

  const [summary, setSummary] = useState<BridgeOverviewInfo>();
  const [product, setProduct] = useState<BridgeOverviewInfo>();
  const [loanDetail, setLoanDetail] = useState<BridgeOverviewInfo>();
  const [thirdParty, setThirdParty] = useState<BridgeOverviewInfo>();

  const { loading } = useAsync(async () => {
    return await _fetchOverviewLoanSummary<BPOverviewSummaryData>(
      lastSelectedProcessId as string,
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
                <Box
                  style={{
                    ...POSFlex('flex-end', 'center', 'column'),
                    width: '100%',
                  }}
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
                </Box>
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
              label: `${summary.isCor ? 'Loan to Cost' : 'Loan to Value(LTV)'}`,
              info: POSFormatPercent(
                summary.isCor ? loanDetail?.ltc : loanDetail?.ltv,
              ),
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
        // todo, lee this error need to handler
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
      });
  });

  return (
    <Box className={'container'} sx={useStyles}>
      <PageHeader
        subTitle={
          'Everything about your loan found in one place. Get updates and see what needs to be done before you close.'
        }
        title={'Your Loan Overview'}
      />
      <Box className={'content'}>
        <Box className={'contentItem'} mr={'24px'}>
          <Card
            dataList={summary?.info}
            loading={loading}
            subInfo={summary?.subInfo}
            subTitle={summary?.subTitle}
            title={summary?.title}
          >
            <StyledButton
              className={'cardButton'}
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
          </Card>
          <Card
            dataList={product?.info}
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
              variant={'contained'}
            >
              Explore Rate
            </StyledButton>
          </Card>
        </Box>
        <Box className={'contentItem'}>
          <Card
            dataList={loanDetail?.info}
            loading={loading}
            mt={'24px'}
            subInfo={loanDetail?.subInfo}
            subTitle={loanDetail?.subTitle}
            title={loanDetail?.title}
          />
          <Card
            dataList={thirdParty?.info}
            loading={loading}
            mt={'24px'}
            style={{
              flex: 1,
            }}
            subInfo={thirdParty?.subInfo}
            subTitle={thirdParty?.subTitle}
            title={thirdParty?.title}
          />
        </Box>
      </Box>
      <Box className="footer">
        <Box>
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
        </Box>
        <Box mt={3}>
          <Box fontSize={14}>Disclaimer</Box>
          <Box mt={1.5}>
            The total loan amount is an estimate, and may be subject to change.
            The amount also does not include third party settlement costs that
            may be required to close your loan. For more details on those
            potential costs, please contact your settlement agent.
          </Box>
          <Box mt={1}>
            Rates displayed are subject to rate lock and are not to be
            considered an extension or offer of credit by
            {
              // todo: sass
              ' ' + state?.organizationName || ' YouLand'
            }
            .
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
