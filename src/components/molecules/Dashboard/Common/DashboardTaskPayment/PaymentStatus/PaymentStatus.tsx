import { _restartPaymentPipeline } from '@/requests/dashboard';
import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardTaskPaymentMethodsStatus } from '@/types';
import { useSessionStorageState } from '@/hooks';
import { POSFormatUSPhoneToText } from '@/utils';

import { StyledButton, StyledFormItem } from '@/components/atoms';

interface PaymentStatusProps {
  paymentStatus: DashboardTaskPaymentMethodsStatus;
}

export const PaymentStatus: FC<PaymentStatusProps> = ({ paymentStatus }) => {
  const router = useRouter();

  const { saasState } = useSessionStorageState('tenantConfig');

  const renderResult = useMemo(() => {
    switch (paymentStatus) {
      case DashboardTaskPaymentMethodsStatus.complete:
        return (
          <>
            <StyledFormItem
              gap={3}
              label={'Payment Successful!'}
              labelSx={{ color: 'success.main' }}
              tip={
                <>
                  <Typography variant={'body1'}>
                    Thank you, we have received your payment for the property
                    appraisal. Meanwhile, your loan officer is helping you
                    confirm the rate. We&apos;ll keep you updated on the
                    progress.
                  </Typography>
                  <Typography mt={1.5} variant={'body1'}>
                    Should you require additional assistance, email us at
                    <Typography className={'link_style'} component={'span'}>
                      {/* todo sass */}{' '}
                      {saasState?.extInfo?.posSettings?.email ||
                        'borrow@youland.com'}{' '}
                    </Typography>
                    or call toll free at{' '}
                    <Typography className={'link_style'} component={'span'}>
                      {POSFormatUSPhoneToText(
                        saasState?.extInfo?.posSettings?.phone,
                      ) || '1-833-968-5263'}{' '}
                    </Typography>
                  </Typography>
                </>
              }
            >
              <StyledButton
                onClick={async () =>
                  await router.push({
                    pathname: '/dashboard/tasks/',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ width: '100%', maxWidth: 600 }}
              >
                Go to Tasks
              </StyledButton>
            </StyledFormItem>
          </>
        );
      case DashboardTaskPaymentMethodsStatus.fail:
        return (
          <>
            <StyledFormItem
              gap={3}
              label={'Payment Failed!'}
              labelSx={{ color: 'error.main' }}
              tip={
                'It seems we have not received money. You may contact your payment provider for further details.'
              }
            >
              <Stack
                flexDirection={'row'}
                gap={3}
                maxWidth={600}
                width={'100%'}
              >
                <StyledButton
                  color={'info'}
                  onClick={async () =>
                    await router.push({
                      pathname: '/dashboard/tasks',
                      query: { processId: router.query.processId },
                    })
                  }
                  sx={{ flex: 1 }}
                  variant={'text'}
                >
                  Go to Tasks
                </StyledButton>
                <StyledButton
                  onClick={async () => {
                    await _restartPaymentPipeline(
                      router.query.taskId as string,
                    );
                    await router.reload();
                  }}
                  sx={{ flex: 1 }}
                >
                  Try Again
                </StyledButton>
              </Stack>
            </StyledFormItem>
          </>
        );
      case DashboardTaskPaymentMethodsStatus.processing:
        return (
          <>
            <StyledFormItem
              gap={3}
              label={'Important!'}
              labelSx={{ color: 'warning.main' }}
              tip={
                <Typography variant={'body1'}>
                  Your transaction is still in progress. Don&apos;t worry your
                  money is safe! If money was debited from your account, you can
                  call toll free at{' '}
                  <span className={'link_style'}>
                    {/* todo sass */}{' '}
                    {POSFormatUSPhoneToText(
                      saasState?.extInfo?.posSettings?.phone,
                    ) || '1-833-968-5263'}{' '}
                  </span>{' '}
                  or email us at
                  <span className={'link_style'}>
                    {/* todo sass */}{' '}
                    {saasState?.extInfo?.posSettings?.email ||
                      'borrow@youland.com'}{' '}
                  </span>
                  . We can help you with the refund.
                </Typography>
              }
            >
              <StyledButton
                onClick={async () =>
                  await router.push({
                    pathname: '/dashboard/overview',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ width: '100%', maxWidth: 600 }}
              >
                Go to Overview
              </StyledButton>
            </StyledFormItem>
          </>
        );
    }
  }, [
    paymentStatus,
    router,
    saasState?.extInfo?.posSettings?.email,
    saasState?.extInfo?.posSettings?.phone,
  ]);

  return <>{renderResult}</>;
};
