import { PaymentIntent } from '@stripe/stripe-js';

export interface StyledPaymentCardProps {
  secret: string | undefined;
  amount?: number | undefined;
  title?: string;
  subtitle?: string;
  mode?: 'check' | 'uncheck';
  cb?: (status: PaymentIntent.Status) => void;
}

export interface StyledPaymentCardRef {
  onSubmit: (e: any) => Promise<any>;
}
