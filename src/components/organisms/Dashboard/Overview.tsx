import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { useBreakpoints, useSessionStorageState } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import {
  OverviewIconList,
  OverviewLoanAddress,
  OverviewLoanDetails,
  OverviewLoanStatus,
} from '@/components/molecules';

import { HttpError } from '@/types';
import { _fetchLoanDetail } from '@/requests/dashboard';

export const Overview: FC = () => {
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: { data },
      } = await _fetchLoanDetail(loanId);
      setOverviewData(data);
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

  const [overviewData, setOverviewData] = useState<any>(null);

  return loading ? (
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
    <Fade in={!loading}>
      <Stack
        gap={3}
        justifyContent={'flex-start'}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Your loan overview
        </Typography>

        <OverviewIconList
          compensationFee={overviewData?.compensationFee}
          interestRate={overviewData?.interestRate}
          monthlyPayment={overviewData?.monthlyPayment}
          totalLoanAmount={overviewData?.totalLoanAmount}
        />

        <Stack
          flexDirection={{ xs: 'column', xl: 'row' }}
          gap={3}
          width={'100%'}
        >
          <Stack gap={3} width={{ xs: '100%', xl: 'calc(67% - 12px)' }}>
            <OverviewLoanStatus
              loanStatus={overviewData?.loanStatus}
              loanStatusDetails={overviewData?.loanStatusDetails}
            />
            <OverviewLoanDetails {...overviewData} />
          </Stack>

          <OverviewLoanAddress
            isCustom={overviewData?.isCustom}
            propertyAddress={overviewData?.propertyAddress}
          />
        </Stack>

        <Stack gap={1.25}>
          <Typography color={'text.secondary'} variant={'body3'}>
            Disclaimer
          </Typography>
          <Typography color={'text.secondary'} variant={'body3'}>
            The total loan amount is an estimate, and may be subject to change.
            The amount also does not include third party settlement costs that
            may be required to close your loan. For more details on those
            potential costs, please contact your settlement agent.
          </Typography>
          <Typography color={'text.secondary'} variant={'body3'}>
            Rates displayed are subject to change and are not to be considered
            an extension or offer of credit by {saasState?.organizationName}.
          </Typography>
        </Stack>
      </Stack>
    </Fade>
  );
};
