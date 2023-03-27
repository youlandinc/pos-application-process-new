export function SPDecorator<T extends new (...args: any[]) => any>(
  factory: T,
): (...args: ConstructorParameters<T>) => InstanceType<T> {
  let instance: InstanceType<T> | undefined;
  return (...args) => {
    if (instance === void 0) {
      instance = new factory(...args);
    }
    return instance;
  };
}
