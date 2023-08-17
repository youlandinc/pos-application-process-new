export const POSFindLabel = (
  options: Option[],
  val: number | string,
): string => {
  return options.find((item) => item.value === val)?.label || '';
};

export const POSGetProductTypeByUrl = (val: string): string => {
  const condition = val.split(' ')[0];
  switch (condition) {
    case 'Mortgage':
      return 'mortgage';
    case 'Bridge':
      return 'bridge';
    case 'Fix':
      return 'fix_and_flip';
    case 'Ground-up':
      return 'ground_up_construction';
    default:
      return '';
  }
};

export const POSUpperFirstLetter = (val: string): string => {
  return val.charAt(0).toUpperCase() + val.slice(1);
};
