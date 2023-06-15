export interface StyledPaymentCardProps {
  secret: string | undefined;
  amount: number | undefined;
  title?: string;
  subtitle?: string;
}

export interface StyledPaymentCardRef {
  onSubmit: (e: any) => Promise<any>;
}
