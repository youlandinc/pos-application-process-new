import { POSFormatDollar } from '@/utils';
import {
  FormEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Box } from '@mui/material';
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
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import {
  StyledPaymentCardProps,
  StyledPaymentCardRef,
  StyledPaymentCardStyles,
} from './index';

import { Transitions } from '@/components/atoms';

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
      amount,
      title = 'Pay with card',
      subtitle = 'Safe and instant payments using your credit card.',
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

      if (!stripe || !elements || !elements.getElement(CardNumberElement)) {
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
        return { error, status: 'fail' };
      }
      if (paymentIntent?.status === 'succeeded') {
        return { paymentIntent, status: 'complete' };
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
              Card Number
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
          <Box className={'payment_summary'}>
            Total payment:{POSFormatDollar(amount)}
          </Box>
        </Box>
      </>
    );
  },
);

export const StyledPaymentCard = forwardRef<
  StyledPaymentCardRef,
  StyledPaymentCardProps
>(
  (
    {
      secret,
      amount,
      title = 'Pay with card',
      subtitle = 'Safe and instant payments using your credit card.',
    },
    ref,
  ) => {
    return (
      <>
        {secret && stripePromise ? (
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
          'loading'
        )}
      </>
    );
  },
);
