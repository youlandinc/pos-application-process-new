import {
  forwardRef,
  SyntheticEvent,
  useImperativeHandle,
  useState,
} from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { loadStripe } from '@stripe/stripe-js';
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { useSwitch } from '@/hooks';

import { AppraisalTaskPaymentStatus } from '@/types';
import { StyledPaymentCardProps, StyledPaymentCardRef } from './index';

import {
  StyledButton,
  StyledCheckbox,
  //Transitions
} from '@/components/atoms';
import { POSFont } from '@/styles';
import { theme } from '@/theme';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISH_KEY as string)
  .then((res) => res)
  .catch((err) => err);

const _StyledSpecialPaymentCard = forwardRef<
  StyledPaymentCardRef,
  StyledPaymentCardProps
>(({ secret, cb, hideFooter }, ref) => {
  const { enqueueSnackbar } = useSnackbar();

  const { visible, close, open } = useSwitch(true);

  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    if (secret === '') {
      setIsLoading(false);
      enqueueSnackbar('missing a client secret!', {
        variant: 'error',
      });
      return;
    }

    const { error, paymentIntent } = await stripe
      .confirmPayment({
        elements,
        redirect: 'if_required',
      })
      .finally(() => {
        setIsLoading(false);
      });

    if (error) {
      const { message } = error;
      enqueueSnackbar(message || 'payment error!', {
        variant: 'error',
        header: 'Payment error',
        isSimple: false,
      });
      return { error, status: AppraisalTaskPaymentStatus.fail };
    }

    if (paymentIntent?.status === 'succeeded') {
      cb?.(paymentIntent.status);
      return {
        paymentIntent,
        status: AppraisalTaskPaymentStatus.complete,
      };
    }
  };

  useImperativeHandle(ref, () => {
    return {
      onSubmit,
    };
  });

  return (
    <Stack component={'form'} gap={3} onSubmit={onSubmit}>
      <PaymentElement className={'STRIPE_PAYMENT_ELEMENT'} options={{}} />
      <Typography variant={'subtitle1'}>Add billing address</Typography>
      <AddressElement
        className={'STRIPE_ADDRESS_ELEMENT'}
        options={{ mode: 'billing' }}
      />
      {!hideFooter && (
        <Stack
          direction={{ xl: 'row', xs: 'column' }}
          gap={{ xl: 6, xs: 3 }}
          justifyContent={'space-between'}
        >
          <StyledCheckbox
            checked={!visible}
            label={
              <>
                <strong>Important: </strong> By proceeding, you acknowledge that
                the payment amount is subject to change if there are extenuated
                circumstances about the property like large property, location,
                etc. Furthermore, if your property doesn&apos;t meet the
                required standards at the time of the inspection, you&apos;ll be
                responsible for the cost of a second appraisal.
              </>
            }
            onChange={(e) => {
              e.target.checked ? close() : open();
            }}
            sx={{
              alignItems: 'flex-start',
              // width: '100%',
              '& .MuiFormControlLabel-label': {
                width: '100%',
                ml: 1.5,
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                ...POSFont(14, 400, 1.5, 'text.primary'),
              },
              '& .Mui-checked': {
                '& svg > path': {
                  fill: `hsla( 222
                ,42%,55%,1) !important`,
                },
              },
              '& .MuiCheckbox-root': {
                mt: '-9px',
                mr: '-11px',
                '& svg > path': {
                  fill: '#929292',
                },
              },
              '& .Mui-disabled': {
                '& svg > path': {
                  fill: `${theme.palette.action.disabled} !important`,
                },
              },
            }}
          />

          <StyledButton
            disabled={visible}
            loading={isLoading}
            size={'large'}
            sx={{ flexShrink: 0, width: { xl: 120, xs: '100%' } }}
            type="submit"
            variant="contained"
          >
            Pay now
          </StyledButton>
        </Stack>
      )}
    </Stack>
  );
});

export const StyledPaymentCard = forwardRef<
  StyledPaymentCardRef,
  StyledPaymentCardProps
>(({ hideFooter, secret, cb }, ref) => {
  return (
    <>
      {secret && stripePromise ? (
        <Elements
          options={{
            locale: 'en',
            clientSecret: secret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#5B76BC',
                colorBackground: '#ffffff',
                colorText: '#9095A3',
                colorDanger: '#df1b41',
                fontFamily: 'Poppins, system-ui, sans-serif',
                fontSizeXl: '18px',
              },
            },
          }}
          stripe={stripePromise}
        >
          <_StyledSpecialPaymentCard
            cb={cb}
            hideFooter={hideFooter}
            ref={ref}
            secret={secret}
          />
        </Elements>
      ) : (
        'loading'
      )}
    </>
  );
});
