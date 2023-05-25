import { StyledTextFieldProps } from '@/components/atoms';

export type StyledTextFieldSocialNumberProps = StyledTextFieldProps & {
  value: string;
  onValueChange: (value: string) => void;
};
