import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { SUploadData, UploadData } from '@/models/common/UploadFile';

import {
  PipelineGovernment,
  PipelineTaskItem,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/pipeline';
import { AccountRoleTaskItemStatus } from '@/types';

export const PTGovernment = types
  .model({
    taskName: PipelineTaskName[PipelineTaskKey.BG],
    taskId: types.maybe(types.string),
    taskStatus: types.maybe(
      types.union(
        types.literal(AccountRoleTaskItemStatus.unfinished),
        types.literal(AccountRoleTaskItemStatus.finished),
        types.literal(AccountRoleTaskItemStatus.confirmed),
      ),
    ),
    taskForm: types.model({
      taskFiles: types.array(UploadData),
    }),
  })
  .actions((self) => {
    return {
      injectPipelineTaskData(data: PipelineTaskItem<PipelineGovernment>) {
        const { taskName, taskId, taskStatus, taskForm } = data;
        self.taskName = taskName;
        self.taskId = taskId;
        self.taskStatus = taskStatus;
        if (taskForm?.taskFiles) {
          self.taskForm.taskFiles = cast(
            taskForm?.taskFiles as unknown as SUploadData[],
          );
        }
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
      addFile(uploadData: SUploadData) {
        self.taskForm.taskFiles.push(uploadData);
      },
      removeFile(index: number) {
        self.taskForm.taskFiles.splice(index, 1);
      },
      getPostData() {
        const { taskId } = self;
        return {
          taskId,
          taskForm: {
            taskFiles: getSnapshot(self.taskForm.taskFiles),
          },
        };
      },
    };
  });

export type IPTGovernment = Instance<typeof PTGovernment>;
export type SPTGovernment = SnapshotOut<typeof PTGovernment>;
