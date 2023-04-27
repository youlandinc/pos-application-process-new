export interface SearchBarProps {
  searchForm: {
    propertyAddress: string;
    loanStage: string[];
    loanSpecies: string[];
    dateRange: [Date | null, Date | null];
  };
  onParamsChange: (
    k: keyof SearchBarProps['searchForm'],
    v: string | string[] | [Date | null, Date | null] | boolean,
  ) => void;
  onValueChange: (v: boolean) => void;
}
