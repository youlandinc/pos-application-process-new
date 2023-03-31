import { VariableName, VariableValue } from '@/types';

export const POSFindSpecificVariable = <T extends VariableValue = any>(
  name: VariableName,
  variables: Variable<T>[],
): { name: string; type: VariableType; value: T } | undefined => {
  return variables?.find((v) => v.name === name);
};
