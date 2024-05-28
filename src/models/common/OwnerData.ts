import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { QualificationQuestionnaireLicenseType } from '@/types';

export const OwnerData = types.model({
  id: types.maybe(types.string),
  firstName: types.maybe(types.string),
  lastName: types.maybe(types.string),
  ssn: types.maybe(types.string),
  birthday: types.maybeNull(types.union(types.Date, types.string)),
  state: types.maybe(types.string),
  licenseType: types.maybe(
    types.union(
      types.literal(QualificationQuestionnaireLicenseType.default),
      types.literal(QualificationQuestionnaireLicenseType.dre_salesperson),
      types.literal(QualificationQuestionnaireLicenseType.dre_broker),
      types.literal(QualificationQuestionnaireLicenseType.nmls),
    ),
  ),
  license: types.maybe(types.string),
});

export type IOwnerData = Instance<typeof OwnerData>;
export type SOwnerData = SnapshotOut<typeof OwnerData>;
