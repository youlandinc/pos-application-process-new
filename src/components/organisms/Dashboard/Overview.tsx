import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledButton, StyledLoading } from '@/components/atoms';
import {
  OverviewChecklist,
  OverviewEstDate,
  OverviewLoanStatus,
} from '@/components/molecules';

import {
  DashboardOverviewResponse,
  HttpError,
  PipelineLoanStageEnum,
} from '@/types';
import { _fetchLoanDetail } from '@/requests/dashboard';

export const Overview: FC = observer(() => {
  const router = useRouter();
  const { dashboardInfo } = useMst();

  const { enqueueSnackbar } = useSnackbar();

  const [loanStatus, setLoanStatus] = useState<
    DashboardOverviewResponse['data']['loanStatus']
  >(PipelineLoanStageEnum.scenario);
  const [loanStatusDetails, setLoanStatusDetails] =
    useState<DashboardOverviewResponse['data']['loanStatusDetails']>();
  const [estDate, setEstDate] = useState('');

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
    if (!dashboardInfo) {
      return;
    }
    try {
      const {
        data: {
          data: { loanStatus, loanStatusDetails, loanTasks, estDate },
        },
      } = await _fetchLoanDetail(loanId);
      setLoanStatus(loanStatus);
      setLoanStatusDetails(loanStatusDetails);
      dashboardInfo.setLoanTasks(loanTasks);
      setEstDate(estDate);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [location?.href, dashboardInfo]);

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
        flexDirection={{ xs: 'column', lg: 'row' }}
        gap={6}
        justifyContent={'flex-start'}
        mx={{ lg: 'auto', xs: 0 }}
        width={'100%'}
      >
        <Stack flex={1.5} flexShrink={0} gap={{ xs: 6, lg: 9 }}>
          {dashboardInfo.taskOrder.length === 0 ? (
            <Stack gap={1.5}>
              <Typography fontSize={{ xs: 20, md: 24 }}>
                You&apos;re all set for now!
              </Typography>
              <Typography mt={1.5} variant={'body2'}>
                You&apos;ve completed all your tasks, and we&apos;re handling
                the next steps. Relax and let us take it from here—we&apos;ll
                reach out if we need anything or when there&apos;s an update.
              </Typography>
            </Stack>
          ) : (
            <Stack gap={1.5}>
              <Typography fontSize={{ xs: 20, md: 24 }}>
                Congratulations!
              </Typography>
              <Typography mt={1.5} variant={'body2'}>
                We&apos;ve put together a list of steps for you to take to move
                ahead with this loan. We&apos;ll be able to work on the loan
                once you&apos;ve completed all of your steps.
              </Typography>
              <Typography variant={'body2'}>
                Not sure where to start? Click the button below and we&apos;ll
                choose the best step for you to work on.
              </Typography>
              <StyledButton
                onClick={async () => {
                  await dashboardInfo.jumpToNextTask();
                }}
                size={'small'}
                sx={{ width: 100, mt: 3 }}
              >
                Next step
              </StyledButton>
            </Stack>
          )}

          <OverviewChecklist />
        </Stack>

        <Stack flex={1} flexShrink={0} gap={{ xs: 6, lg: 9 }} width={'100%'}>
          <OverviewLoanStatus
            loanStatus={loanStatus}
            loanStatusDetails={loanStatusDetails!}
          />

          <OverviewEstDate estDate={estDate} />
        </Stack>
      </Stack>
    </Fade>
  );
});
