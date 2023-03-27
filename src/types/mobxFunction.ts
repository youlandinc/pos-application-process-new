import { types } from 'mobx-state-tree';

const parseFunction = (value: string) => {
  const fn = eval(`(${value})`);
  if (typeof fn !== 'function')
    throw new Error(`${value} is not a valid function`);
  return fn;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const functionType = types.custom<string, Function>({
  name: 'functionType',
  fromSnapshot(value: string) {
    return parseFunction(value);
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  toSnapshot(value: Function) {
    return value.toString();
  },
  getValidationMessage(value: string) {
    try {
      parseFunction(value);
      return '';
    } catch (e) {
      return `value "${value}" is Not a valid function ${e}`;
    }
  },
  isTargetType(value: any) {
    return value instanceof Function;
  },
});
