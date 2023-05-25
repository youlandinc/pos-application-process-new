import { FC, useMemo } from 'react';

import { useRouter } from 'next/router';
// import { IDashboardTask } from '@/models/DashboardTask';

import {
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  HighlightOffOutlined,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { StyledButton } from '@/components/atoms';
import { IDTask } from '@/models/base';
import { STaskItemStatus } from '@/requests/dashboard';
import { POSFlex } from '@/styles';
import { useSessionStorageState } from '@/hooks';
import { POSFormatUSPhoneToText } from '@/utils';

const useStyle = {
  '&.container': {
    ...POSFlex('flex-start', 'flex-start', 'column'),
    maxWidth: 900,
  },
  '& .title': {
    display: 'flex',
    alignItems: 'center',
    fontSize: 36,
    fontWeight: 700,
  },
  '& .iconStyle': {
    height: 36,
    width: 36,
    mr: 1,
  },
  '& .subTitle': {
    mt: 3,
    fontSize: 16,
    lineHeight: 1.5,
    color: 'rgba(0,0,0,.6)',
  },
};

interface PaymentStatusPageProps {
  paymentStatus: 'fail' | 'complete' | 'processing';
  task: IDTask;
}

export const PaymentStatusPage: FC<PaymentStatusPageProps> = (props) => {
  const { paymentStatus, task } = props;

  const router = useRouter();
  const { state } = useSessionStorageState('tenantConfig');

  const renderResult = useMemo(() => {
    switch (paymentStatus) {
      case 'complete':
        return (
          <>
            <Box className={'title'} color={'rgba(79, 191, 103, 1)'}>
              <CheckCircleOutlineOutlined className={'iconStyle'} />
              Payment Successful!
            </Box>
            <Box className={'subTitle'}>
              <Box>
                Thank you, we have received your payment for the property
                appraisal. Meanwhile, your loan officer is helping you confirm
                the rate. We&apos;ll keep you updated on the progress.
              </Box>
              <Box>
                Should you require additional assistance, email us at
                <span className={'link_style'}>
                  {/* todo sass */}{' '}
                  {state?.extInfo?.posSettings?.email || 'borrow@youland.com'}{' '}
                </span>
                or call toll free at
                <span className={'link_style'}>
                  {' '}
                  {POSFormatUSPhoneToText(state?.extInfo?.posSettings?.phone) ||
                    '1-833-968-5263'}{' '}
                </span>
              </Box>
            </Box>
            <Box mt={'48px'} sx={{ width: '100%' }}>
              <StyledButton
                onClick={async () => await router.push('/dashboard/overview')}
                sx={{ width: '100%' }}
              >
                Go to Overview
              </StyledButton>
            </Box>
          </>
        );
      case 'fail':
        return (
          <>
            <Box className={'title'} color={'rgba(191, 63, 56, 1)'}>
              <HighlightOffOutlined className={'iconStyle'} />
              Payment Failed!
            </Box>
            <Box className={'subTitle'} mt={'24px'}>
              It seems we have not received money. You may contact your payment
              provider for further details.
            </Box>
            <Box mt={'48px'} sx={{ width: '100%' }}>
              <StyledButton
                onClick={() => {
                  task.changeFieldValue(
                    'paymentStatus',
                    'undone' as STaskItemStatus,
                  );
                  task.fetchTaskItemStatus();
                }}
                sx={{ width: '100%' }}
              >
                Go to Tasks
              </StyledButton>
              <StyledButton
                onClick={() => {
                  task.changeFieldValue(
                    'paymentStatus',
                    'undone' as STaskItemStatus,
                  );
                  task.fetchTaskItemStatus();
                }}
                sx={{ width: '100%' }}
              >
                Try Again
              </StyledButton>
            </Box>
          </>
        );
      case 'processing':
        return (
          <>
            <Box className={'title'} color={'rgba(255, 171, 43, 1)'}>
              <ErrorOutlineOutlined className={'iconStyle'} />
              Important!
            </Box>
            <Box className={'subTitle'} mt={'24px'}>
              Your transaction is still in progress. Don&apos;t worry your money
              is safe! If money was debited from your account, you can call toll
              free at{' '}
              <span className={'link_style'}>
                {/* todo sass */}{' '}
                {POSFormatUSPhoneToText(state?.extInfo?.posSettings?.phone) ||
                  '1-833-968-5263'}{' '}
              </span>{' '}
              or email us at
              <span className={'link_style'}>
                {/* todo sass */}{' '}
                {state?.extInfo?.posSettings?.email || 'borrow@youland.com'}{' '}
              </span>
              . We can help you with the refund.
            </Box>
            <Box mt={'48px'} sx={{ width: '100%' }}>
              <StyledButton
                onClick={async () => await router.push('/dashboard/overview')}
                sx={{ width: '100%' }}
              >
                Go to Overview
              </StyledButton>
            </Box>
          </>
        );
    }
  }, [
    paymentStatus,
    router,
    state?.extInfo?.posSettings?.email,
    state?.extInfo?.posSettings?.phone,
    task,
  ]);
  return (
    <Box className={'container'} sx={useStyle}>
      {renderResult}
    </Box>
  );
};
