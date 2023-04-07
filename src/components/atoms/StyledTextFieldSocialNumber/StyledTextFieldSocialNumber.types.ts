import { StyledTextFieldTypes } from '@/components/atoms';

export type StyledTextFieldSocialNumberTypes = StyledTextFieldTypes & {
  value: string;
  onChange: (value: string) => void;
};
