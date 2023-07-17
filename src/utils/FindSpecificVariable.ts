import { VariableName, VariableValue } from '@/types';

export const POSFindSpecificVariable = <T extends VariableValue = any>(
  name: VariableName,
  variables: Variable<T>[],
): Variable<T> | undefined => {
  return variables?.find((v) => v.name === name);
};
