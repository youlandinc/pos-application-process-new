import { StyledSelectProps } from '@/components/atoms';

export interface StyledSelectMultipleProps
  extends Omit<StyledSelectProps, 'value'> {
  value: unknown[];
  onValueChange: (value: any[]) => void;
}
