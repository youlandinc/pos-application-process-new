import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import {
  PipelineTaskKey,
  PipelineTaskName,
  PipelineTaskItemStatus,
} from '@/types/enum';
import { SUploadData, UploadData } from '@/models/UploadFile';
import { PipelineTaskItem, PipelineW9 } from '@/types/myApplicationData';

export const PTW9 = types
  .model({
    taskName: PipelineTaskName[PipelineTaskKey.WF],
    taskId: types.maybe(types.string),
    taskStatus: types.maybe(
      types.union(
        types.literal(PipelineTaskItemStatus.UNFINISHED),
        types.literal(PipelineTaskItemStatus.FINISHED),
        types.literal(PipelineTaskItemStatus.CONFIRMED),
      ),
    ),
    taskForm: types.maybe(
      types.model({
        taskFiles: types.array(UploadData),
      }),
    ),
  })
  .actions((self) => {
    return {
      injectPipelineTaskData(data: PipelineTaskItem<PipelineW9>) {
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
        const temp = [].concat(self.taskForm.taskFiles);
        temp.push(uploadData);
        self.taskForm.taskFiles = cast(temp);
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

export type IPTW9 = Instance<typeof PTW9>;
export type SPTW9 = SnapshotOut<typeof PTW9>;
