export interface StyledPaymentCardProps {
  secret: string;
  amount: number;
  title?: string;
  subtitle?: string;
}

export interface StyledPaymentCardRef {
  onSubmit: (e: any) => Promise<any>;
}
