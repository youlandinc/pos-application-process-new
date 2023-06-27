import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { PipelineLicenseTypeOpt } from '@/types/options';

export const PQOwnerData = types.model({
  ownerName: types.maybe(types.string),
  ssn: types.maybe(types.string),
  birthday: types.maybeNull(types.union(types.Date, types.string)),
  state: types.maybe(types.string),
  licenseType: types.maybe(
    types.union(
      types.literal(PipelineLicenseTypeOpt.default),
      types.literal(PipelineLicenseTypeOpt.dre_sale_person),
      types.literal(PipelineLicenseTypeOpt.dre_broker),
      types.literal(PipelineLicenseTypeOpt.nmls),
    ),
  ),
  license: types.maybe(types.string),
});

export type IPQOwnerData = Instance<typeof PQOwnerData>;
export type SPQOwnerData = SnapshotOut<typeof PQOwnerData>;
