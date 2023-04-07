import { StyledTextFieldTypes } from '@/components/atoms';

export interface StyledTextFieldNumberProps extends StyledTextFieldTypes {
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
}
