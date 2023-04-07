import { StyledTextFieldTypes } from '@/components/atoms';

export type StyledTextFieldSocialNumberTypes = StyledTextFieldTypes & {
  value: string;
  onValueChange: (value: string) => void;
};
