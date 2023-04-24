import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { ProcessData, ServerTaskKey } from '@/types';

export const Bpmn = types
  .model({
    processId: types.maybe(types.string),
    taskId: types.maybe(types.string),
    ServerTaskKey: types.maybe(types.frozen<ServerTaskKey>()),
    owners: types.frozen<ProcessData['owners']>(),
    variables: types.maybe(types.array(types.frozen<Record<string, any>>({}))),
  })
  .actions((self) => ({
    setProcessId(processId: string) {
      self.processId = processId;
    },
    setTaskId(taskId: string) {
      self.taskId = taskId;
    },
    setTaskKey(ServerTaskKey: (typeof self)['ServerTaskKey']) {
      self.ServerTaskKey = ServerTaskKey;
    },
    setOwners(owners: ProcessData['owners']) {
      self.owners = cast(owners);
    },
    setVariables(variables: Array<Record<string, any>>) {
      self.variables = cast(variables);
    },
  }));

export type IBpmn = Instance<typeof Bpmn>;
export type SBpmn = SnapshotIn<typeof Bpmn>;
