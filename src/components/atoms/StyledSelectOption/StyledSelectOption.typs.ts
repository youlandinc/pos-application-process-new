export interface StyledSelectOptionProps {
  options: Option[];
  onChange: (value: string | number) => void;
  value: string | number | unknown;
}
