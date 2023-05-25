import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { observable } from 'mobx';
import { DetectActiveService } from '@/services/DetectActive';

export const DetectUserActiveService = types
  .model({})
  .volatile<{
    instance: Maybe<DetectActiveService>;
  }>(() =>
    observable({
      instance: void 0,
    }),
  )
  .actions((self) => ({
    setDetectUserActiveService(instance: DetectActiveService | undefined) {
      self.instance = instance;
    },
  }));

export type IDetectUserActiveService = Instance<typeof DetectUserActiveService>;
export type SDetectUserActiveService = SnapshotOut<
  typeof DetectUserActiveService
>;
