import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const UploadData = types.model({
  originalFileName: types.maybe(types.string),
  fileName: types.maybe(types.string),
  url: types.maybe(types.string),
  uploadTime: types.maybe(types.string),
});

export type IUploadData = Instance<typeof UploadData>;
export type SUploadData = SnapshotOut<typeof UploadData>;
