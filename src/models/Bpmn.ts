import { cast, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { ServerTaskKey } from '@/types/enum';
import { ProcessData } from '@/types/server';

export const Bpmn = types
  .model({
    processId: types.string,
    taskId: types.string,
    ServerTaskKey: types.frozen<ServerTaskKey>(),
    owners: types.frozen<ProcessData['owners']>(),
    variables: types.array(types.frozen<Record<string, any>>({})),
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
