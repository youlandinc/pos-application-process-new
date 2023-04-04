import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const UserProfile = types.model({}).actions((self) => ({}));

export type IUserProfile = Instance<typeof UserProfile>;
export type SUserProfile = SnapshotOut<typeof UserProfile>;
