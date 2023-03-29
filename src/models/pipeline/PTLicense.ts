import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import {
  PipelineTaskItemStatus,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/enum';
import { SUploadData, UploadData } from '@/models/UploadFile';
import { PipelineLicense, PipelineTaskItem } from '@/types/myApplicationData';

export const PTLicense = types
  .model({
    taskName: PipelineTaskName[PipelineTaskKey.BL],
    taskId: types.maybe(types.string),
    taskStatus: types.maybe(
      types.union(
        types.literal(PipelineTaskItemStatus.UNFINISHED),
        types.literal(PipelineTaskItemStatus.FINISHED),
        types.literal(PipelineTaskItemStatus.CONFIRMED),
      ),
    ),
    taskForm: types.model({
      taskFiles: types.maybe(types.array(UploadData)),
    }),
  })
  .actions((self) => {
    return {
      injectPipelineTaskData(data: PipelineTaskItem<PipelineLicense>) {
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
        value: typeof self[K],
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

export type IPTLicense = Instance<typeof PTLicense>;
export type SPTLicense = SnapshotOut<typeof PTLicense>;
