import {
  FC,
  FormEvent,
  forwardRef,
  SyntheticEvent,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import {
  loadStripe,
  StripeCardCvcElementChangeEvent,
  StripeCardCvcElementOptions,
  StripeCardExpiryElementChangeEvent,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementChangeEvent,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import {
  AddressElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import { useSwitch } from '@/hooks';

import { DashboardTaskPaymentMethodsStatus } from '@/types';
import {
  StyledPaymentCardProps,
  StyledPaymentCardRef,
  StyledPaymentCardStyles,
} from './index';

import { StyledButton, StyledCheckbox, Transitions } from '@/components/atoms';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISH_KEY as string)
  .then((res) => res)
  .catch((err) => err);

const useOptions: (
  isCardNumber?: boolean,
  placeholder?: string,
) =>
  | StripeCardNumberElementOptions
  | StripeCardCvcElementOptions
  | StripeCardExpiryElementOptions = (
  isCardNumber = false,
  placeholder = '1234 1234 1234 1234',
) => {
  const options: any = {
    showIcon: true,
    iconStyle: 'solid',
    placeholder: placeholder,
    style: {
      base: {
        fontSize: '18px',
        color: 'black',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: 'rgba(0, 0, 0, 0.38)',
        },
      },
      invalid: {
        iconColor: '#BF3F38',
        color: '#BF3F38',
      },
    },
  };
  if (!isCardNumber) {
    delete options.showIcon;
    delete options.iconStyle;
  }
  return options;
};

const _StyledPaymentCard = forwardRef<
  StyledPaymentCardRef,
  StyledPaymentCardProps
>(
  (
    {
      secret,
      // amount,
      // title = 'Pay with card',
      // subtitle = 'Safe and instant payments using your credit card.',
      title,
      subtitle,
    },
    ref,
  ) => {
    const [cardNumberError, setCardNumberError] = useState<string>('');
    const [cardCvcError, setCardCvcError] = useState<string>('');
    const [cardExpiryError, setCardExpiryError] = useState<string>('');

    const stripe = useStripe();
    const elements = useElements();

    const cardNumberElementOptions = useOptions(true);
    const cardCvcElementOptions = useOptions(false, 'CVC');
    const cardExpiryElementOptions = useOptions(false, 'MM/YY');

    const inputChangeHandler = useCallback(
      (
        e:
          | StripeCardNumberElementChangeEvent
          | StripeCardExpiryElementChangeEvent
          | StripeCardCvcElementChangeEvent,
      ) => {
        const { error, elementType } = e;
        switch (elementType) {
          case 'cardNumber':
            setCardNumberError(error?.message ?? '');
            break;
          case 'cardCvc':
            setCardCvcError(error?.message ?? '');
            break;
          case 'cardExpiry':
            setCardExpiryError(error?.message ?? '');
        }
      },
      [],
    );

    const onSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (
        !secret ||
        !stripe ||
        !elements ||
        !elements.getElement(CardNumberElement)
      ) {
        return;
      }

      const payload = await stripe.createPaymentMethod({
        type: 'card',
        //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        card: elements.getElement(CardNumberElement)!,
      });

      if (payload.error) {
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(secret, {
        payment_method: payload.paymentMethod.id,
      });

      if (error) {
        return { error, status: DashboardTaskPaymentMethodsStatus.fail };
      }
      if (paymentIntent?.status === 'succeeded') {
        return {
          paymentIntent,
          status: DashboardTaskPaymentMethodsStatus.complete,
        };
      }
    };

    useImperativeHandle(ref, () => {
      return {
        onSubmit,
      };
    });

    return (
      <>
        <Box sx={StyledPaymentCardStyles}>
          <Box className={'payment_title'}>{title}</Box>
          <Box className={'payment_subtitle'}>{subtitle}</Box>
          <Box className={'payment_form'} component={'form'}>
            <Box
              className={'payment_item_label_fullwidth'}
              component={'label'}
              id={'cardNumber'}
            >
              Card number
              <CardNumberElement
                className={'payment_cardNumber_input'}
                id={'cardNumber'}
                onChange={inputChangeHandler}
                options={cardNumberElementOptions}
              />
              <Transitions>
                {cardNumberError && (
                  <Box className={'payment_item_error'}>{cardNumberError}</Box>
                )}
              </Transitions>
            </Box>
            <Box className={'payment_form_inner_wrap'}>
              <Box
                className={' payment_item_label_flex'}
                component={'label'}
                id={'cardExpiry'}
              >
                Expiration
                <CardExpiryElement
                  className={'payment_cardExpiry_input'}
                  id={'cardExpiry'}
                  onChange={inputChangeHandler}
                  options={cardExpiryElementOptions}
                />
                <Transitions>
                  {cardExpiryError && (
                    <Box className={'payment_item_error'}>
                      {cardExpiryError}
                    </Box>
                  )}
                </Transitions>
              </Box>
              <Box
                className={'payment_item_label_flex'}
                component={'label'}
                id={'cardCvc'}
              >
                CVC
                <CardCvcElement
                  className={'payment_cardCvc_input'}
                  id={'cardCvc'}
                  onChange={inputChangeHandler}
                  options={cardCvcElementOptions}
                />
                <Transitions>
                  {cardCvcError && (
                    <Box className={'payment_item_error'}>{cardCvcError}</Box>
                  )}
                </Transitions>
              </Box>
            </Box>
          </Box>
          {/* <Box className={'payment_summary'}>
               Total payment:{POSFormatDollar(amount)}
               </Box> */}
        </Box>
      </>
    );
  },
);

const _StyledSpecialPaymentCard: FC<
  Pick<StyledPaymentCardProps, 'secret' | 'cb'>
> = ({ secret, cb }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { visible, close, open } = useSwitch(true);

  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
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
      });
      return { error, status: 'fail' };
    }

    if (paymentIntent?.status === 'succeeded') {
      cb?.(paymentIntent.status);
      return { paymentIntent, status: 'complete' };
    }
  };

  return (
    <Stack component={'form'} gap={3} onSubmit={handleSubmit}>
      <PaymentElement className={'STRIPE_PAYMENT_ELEMENT'} options={{}} />
      <Typography variant={'subtitle1'}>Add billing address</Typography>
      <AddressElement
        className={'STRIPE_ADDRESS_ELEMENT'}
        options={{ mode: 'billing' }}
      />
      <Stack direction={'row'} gap={6} justifyContent={'space-between'}>
        <StyledCheckbox
          checked={!visible}
          label={
            <>
              <strong>Important: </strong> I understand that if my home does not
              meet these requirements at the time of inspection, I will be
              required to pay for a second appraisal inspection.
            </>
          }
          onChange={(e) => {
            e.target.checked ? close() : open();
          }}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: 12,
              pl: 1.5,
            },
          }}
        />

        <StyledButton
          disabled={visible}
          loading={isLoading}
          size={'large'}
          sx={{ flexShrink: 0, width: 120 }}
          type="submit"
          variant="contained"
        >
          Pay now
        </StyledButton>
      </Stack>
    </Stack>
  );
};

export const StyledPaymentCard = forwardRef<
  StyledPaymentCardRef,
  StyledPaymentCardProps
>(
  (
    {
      secret,
      amount,
      // title = 'Pay with card',
      // subtitle = 'Safe and instant payments using your credit card.',
      title,
      subtitle,
      mode = 'check',
      cb,
    },
    ref,
  ) => {
    return (
      <>
        {secret && stripePromise ? (
          mode === 'check' ? (
            <Elements options={{ locale: 'en' }} stripe={stripePromise}>
              <_StyledPaymentCard
                amount={amount}
                ref={ref}
                secret={secret}
                subtitle={subtitle}
                title={title}
              />
            </Elements>
          ) : (
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
              <_StyledSpecialPaymentCard cb={cb} secret={secret} />
            </Elements>
          )
        ) : (
          'loading'
        )}
      </>
    );
  },
);
