import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { FeeUnitEnum } from '@/types';

export const AdditionalFee = types.model({
  id: types.maybe(types.string),
  fieldName: types.maybe(types.string),
  unit: types.enumeration(Object.values(FeeUnitEnum)),
  value: types.maybe(types.number),
});

export type IAdditionalFee = Instance<typeof AdditionalFee>;
export type SAdditionalFee = SnapshotOut<typeof AdditionalFee>;
