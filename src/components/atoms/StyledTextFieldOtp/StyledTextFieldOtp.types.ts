export interface StyledTextFieldOtpProps {
  onChange?: (value: string) => void;
  disabled?: boolean;
  values?: string[];
  fields?: number;
  onComplete?: (value: string) => void;
}
