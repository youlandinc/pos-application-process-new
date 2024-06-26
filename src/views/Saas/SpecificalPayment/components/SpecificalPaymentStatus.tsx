import { FC, useMemo } from 'react';
import { Icon, Stack, Typography } from '@mui/material';

import { POSFormatUSPhoneToText } from '@/utils';

import { StyledButton } from '@/components/atoms';

import PAYMENT_SUCCESS from './payment_success.svg';
import PAYMENT_PENDING from './payment_pending.svg';
import PAYMENT_FAIL from './payment_failed.svg';
import { AppraisalTaskPaymentStatus } from '@/types';

export const SpecificalPaymentStatus: FC<{
  paymentStatus: AppraisalTaskPaymentStatus;
  onButtonClick: () => void;
  contactPhoneNumber?: string;
  contactEmail: string;
}> = ({ paymentStatus, onButtonClick, contactPhoneNumber, contactEmail }) => {
  const computedObj = useMemo(() => {
    switch (paymentStatus) {
      case AppraisalTaskPaymentStatus.complete: {
        return {
          icon: PAYMENT_SUCCESS,
          color: '#69C0A5',
          status: 'successful',
          content: (
            <Typography color={'text.secondary'}>
              We have received your payment and will contact you soon to set a
              date for the appraisal. During the visit, an expert will come by
              to check your property&apos;s value, which may include looking
              inside your home.
            </Typography>
          ),
          contact: (
            <Typography color={'text.secondary'}>
              If you have any questions or concerns, email us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  color: 'hsla(222,42%,55%,1)',
                }}
              >
                {contactEmail}
              </a>
              {contactPhoneNumber ? (
                <>
                  {' '}
                  or call toll-free at{' '}
                  <a
                    href={`tel:${contactPhoneNumber}`}
                    style={{
                      color: 'hsla(222,42%,55%,1)',
                    }}
                  >
                    {POSFormatUSPhoneToText(contactPhoneNumber)}
                  </a>
                  .
                </>
              ) : (
                <>.</>
              )}
            </Typography>
          ),
          footer: (
            <StyledButton
              onClick={onButtonClick}
              sx={{ width: 'fit-content', m: '36px auto' }}
              variant={'contained'}
            >
              Continue
            </StyledButton>
          ),
        };
      }
      case AppraisalTaskPaymentStatus.processing: {
        return {
          icon: PAYMENT_PENDING,
          color: '#EEB94D',
          status: 'pending',
          content: (
            <Typography color={'text.secondary'}>
              Your transaction is still pending. Please wait a little bit and
              check again. Don&apos;t worry, this is usually just an issue with
              the transaction process taking longer than expected.
            </Typography>
          ),
          contact: (
            <Typography color={'text.secondary'}>
              If money was debited from your account and the transaction is
              still pending after a hour, you can email us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  color: 'hsla(222,42%,55%,1)',
                }}
              >
                {contactEmail}
              </a>
              {contactPhoneNumber ? (
                <>
                  {' '}
                  or call toll-free at{' '}
                  <a
                    href={`tel:${contactPhoneNumber}`}
                    style={{
                      color: 'hsla(222,42%,55%,1)',
                    }}
                  >
                    {POSFormatUSPhoneToText(contactPhoneNumber)}
                  </a>
                  .
                </>
              ) : (
                <>.</>
              )}
            </Typography>
          ),
          footer: null,
        };
      }
      case AppraisalTaskPaymentStatus.fail: {
        return {
          icon: PAYMENT_FAIL,
          color: '#DE6449',
          status: 'failed',
          content: (
            <Stack>
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
            <Typography color={'text.secondary'}>
              Should you require additional assistance, email us at{' '}
              <a
                href={`mailto:${contactEmail}`}
                style={{
                  color: 'hsla(222,42%,55%,1)',
                }}
              >
                {contactEmail}
              </a>
              {contactPhoneNumber ? (
                <>
                  {' '}
                  or call toll-free at{' '}
                  <a
                    href={`tel:${contactPhoneNumber}`}
                    style={{
                      color: 'hsla(222,42%,55%,1)',
                    }}
                  >
                    {POSFormatUSPhoneToText(contactPhoneNumber)}
                  </a>
                  .
                </>
              ) : (
                <>.</>
              )}
            </Typography>
          ),
          footer: (
            <StyledButton
              onClick={onButtonClick}
              sx={{ width: 'fit-content', m: '36px auto' }}
              variant={'contained'}
            >
              Try again
            </StyledButton>
          ),
        };
      }
    }
  }, [contactEmail, contactPhoneNumber, onButtonClick, paymentStatus]);

  return (
    <Stack gap={3} margin={'0 auto'} maxWidth={900} p={3}>
      <Icon
        component={computedObj?.icon}
        sx={{
          width: 269,
          height: 240,
          m: '0 auto',
        }}
      />
      <Typography
        color={computedObj?.color}
        mt={3}
        textAlign={'center'}
        variant={'h5'}
      >
        Payment {computedObj?.status}
      </Typography>

      {computedObj?.content}
      {computedObj?.contact}
      {computedObj?.footer}
    </Stack>
  );
};
