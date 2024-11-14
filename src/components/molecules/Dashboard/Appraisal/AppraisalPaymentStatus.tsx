import { FC, useMemo } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { AppraisalTaskPaymentStatus } from '@/types';
import { useSessionStorageState } from '@/hooks';
import { POSFormatUSPhoneToText } from '@/utils';

import { StyledButton } from '@/components/atoms';

import { _restartAppraisalPaymentProcess } from '@/requests/dashboard';

import PAYMENT_SUCCESS from '@/views/Saas/SpecificalPayment/components/payment_success.svg';
import PAYMENT_PENDING from '@/views/Saas/SpecificalPayment/components/payment_pending.svg';
import PAYMENT_FAIL from '@/views/Saas/SpecificalPayment/components/payment_failed.svg';

interface PaymentStatusProps {
  paymentStatus: AppraisalTaskPaymentStatus;
}

export const AppraisalPaymentStatus: FC<PaymentStatusProps> = ({
  paymentStatus,
}) => {
  const router = useRouter();

  const { saasState } = useSessionStorageState('tenantConfig');

  const computedObj = useMemo(() => {
    switch (paymentStatus) {
      case AppraisalTaskPaymentStatus.complete: {
        return {
          icon: PAYMENT_SUCCESS,
          color: '#69C0A5',
          status: 'successful',
          content: (
            <Typography color={'text.secondary'} width={'100%'}>
              We have received your payment for the property appraisal and will
              contact you soon to set a date for the appraisal. During the
              visit, an expert will come by to check your property&apos;s value,
              which may include looking inside your home.
            </Typography>
          ),
          contact: (
            <Typography color={'text.secondary'} width={'100%'}>
              If you have any questions or concerns, email us at{' '}
              <a
                href={`mailto:${saasState?.email || 'borrow@youland.com'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {saasState?.email || 'borrow@youland.com'}
              </a>{' '}
              or call toll-free at{' '}
              <a
                href={`tel:${saasState?.phone || '1-833-968-5263'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {POSFormatUSPhoneToText(saasState?.phone || '1-833-968-5263')}
              </a>
              .
            </Typography>
          ),
          footer: (
            <Stack
              alignItems={'center'}
              gap={3}
              maxWidth={600}
              mt={3}
              width={'100%'}
            >
              <StyledButton
                color={'primary'}
                onClick={async () => router.reload()}
                sx={{ flex: 1, maxWidth: 276, width: '100%' }}
              >
                Continue
              </StyledButton>
            </Stack>
          ),
        };
      }
      case AppraisalTaskPaymentStatus.processing: {
        return {
          icon: PAYMENT_PENDING,
          color: '#EEB94D',
          status: 'pending',
          content: (
            <Typography color={'text.secondary'} width={'100%'}>
              Your transaction is still pending. Please wait a little bit and
              check again. Don&apos;t worry, this is usually just an issue with
              the transaction process taking longer than expected.
            </Typography>
          ),
          contact: (
            <Typography color={'text.secondary'} width={'100%'}>
              If money was debited from your account and the transaction is
              still pending after a hour, you can call us toll-free at{' '}
              <a
                href={`tel:${saasState?.phone || '1-833-968-5263'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {POSFormatUSPhoneToText(saasState?.phone || '1-833-968-5263')}
              </a>{' '}
              or email us at{' '}
              <a
                href={`mailto:${saasState?.email || 'borrow@youland.com'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {saasState?.email || 'borrow@youland.com'}
              </a>
              . We can help you with the refund.
            </Typography>
          ),
          footer: (
            <Stack
              flexDirection={'row'}
              gap={3}
              maxWidth={600}
              mt={3}
              width={'100%'}
            >
              <StyledButton
                color={'primary'}
                onClick={async () =>
                  await router.push({
                    pathname: '/dashboard/overview',
                    query: { loanId: router.query.loanId },
                  })
                }
                sx={{ flex: 1 }}
              >
                Go to overview
              </StyledButton>
            </Stack>
          ),
        };
      }
      case AppraisalTaskPaymentStatus.fail: {
        return {
          icon: PAYMENT_FAIL,
          color: '#DE6449',
          status: 'failed',
          content: (
            <Stack width={'100%'}>
              <Typography color={'text.secondary'} variant={'body1'}>
                Your payment couldn&apos;t be processed. Don&apos;t worry,
                we&apos;re here to help.
              </Typography>
              <Typography
                color={'text.secondary'}
                mt={1.5}
                variant={'subtitle1'}
              >
                Quick fixes:
              </Typography>
              <Stack
                component={'ul'}
                sx={{
                  listStyle: 'decimal',
                  listStylePosition: 'inside',
                  p: 0,
                }}
              >
                <Typography color={'text.secondary'} component={'li'}>
                  Verify your card information.
                </Typography>
                <Typography color={'text.secondary'} component={'li'}>
                  Ensure you have sufficient funds.
                </Typography>
                <Typography color={'text.secondary'} component={'li'}>
                  Retry the payment.
                </Typography>
              </Stack>
            </Stack>
          ),
          contact: (
            <Typography color={'text.secondary'} width={'100%'}>
              Should you require additional assistance, email us at{' '}
              <a
                href={`mailto:${saasState?.email || 'borrow@youland.com'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {saasState?.email || 'borrow@youland.com'}
              </a>{' '}
              or call toll-free at{' '}
              <a
                href={`tel:${saasState?.phone || '1-833-968-5263'}`}
                style={{
                  color: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
                }}
              >
                {POSFormatUSPhoneToText(saasState?.phone || '1-833-968-5263')}
              </a>
              .
            </Typography>
          ),
          footer: (
            <Stack gap={3} maxWidth={600} mt={3} width={'100%'}>
              <StyledButton
                onClick={async () => {
                  await _restartAppraisalPaymentProcess(
                    router.query.loanId as string,
                  );
                  router.reload();
                }}
                sx={{ flex: 1, maxWidth: 180, width: '100%' }}
              >
                Try again
              </StyledButton>
            </Stack>
          ),
        };
      }
    }
  }, [
    paymentStatus,
    router,
    saasState?.email,
    saasState?.phone,
    saasState?.posSettings?.h,
  ]);

  return (
    <Stack gap={3} maxWidth={900} p={3} width={'100%'}>
      <Icon
        component={computedObj?.icon}
        sx={{
          width: 200,
          height: 179,
        }}
      />
      <Typography color={computedObj?.color} mt={3} variant={'h5'}>
        Payment {computedObj?.status}
      </Typography>
      {computedObj?.content}
      {computedObj?.contact}
      {computedObj?.footer}
    </Stack>
  );
};
