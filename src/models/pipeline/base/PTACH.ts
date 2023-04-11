import { getSnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/common/Address';
import { UploadData } from '@/models/common/UploadFile';

import {
  PipelineACH,
  PipelineTaskItem,
  PipelineTaskItemStatus,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/pipeline';

export const PTACH = types
  .model({
    taskId: types.maybe(types.string),
    taskName: PipelineTaskName[PipelineTaskKey.AI],
    taskStatus: types.maybe(
      types.union(
        types.literal(PipelineTaskItemStatus.UNFINISHED),
        types.literal(PipelineTaskItemStatus.FINISHED),
        types.literal(PipelineTaskItemStatus.CONFIRMED),
      ),
    ),
    taskForm: types.model({
      bankName: types.maybeNull(types.string),
      address: Address,
      routingNumber: types.maybeNull(types.string),
      accountName: types.maybeNull(types.string),
      accountNumber: types.maybeNull(types.string),
      accountType: types.maybeNull(types.string),
      documentFile: types.maybe(UploadData),
    }),
  })
  .views((self) => ({
    get checkTaskFormValid() {
      return (
        !!self.taskForm.bankName &&
        !!self.taskForm.routingNumber &&
        !!self.taskForm.accountName &&
        !!self.taskForm.accountNumber &&
        !!self.taskForm.accountType &&
        self.taskForm.address.checkAddressValid
      );
    },
    get checkTaskPostForm() {
      return !!self.taskForm.documentFile && this.checkTaskFormValid;
    },
  }))
  .actions((self) => {
    return {
      injectPipelineTaskData(data: PipelineTaskItem<PipelineACH>) {
        if (!data) {
          return;
        }
        const { taskName, taskId, taskStatus, taskForm } = data;
        self.taskName = taskName;
        self.taskId = taskId;
        self.taskStatus = taskStatus;
        if (!taskForm) {
          return;
        }
        const {
          accountType,
          accountNumber,
          routingNumber,
          accountName,
          bankName,
          propAddr,
          documentFile,
        } = taskForm;
        self.taskForm.documentFile = documentFile;
        self.taskForm.accountType = accountType;
        self.taskForm.accountNumber = accountNumber;
        self.taskForm.routingNumber = routingNumber;
        self.taskForm.bankName = bankName;
        self.taskForm.accountName = accountName;
        if (propAddr) {
          self.taskForm.address.injectServerData(propAddr);
        }
      },
      changeFieldValue<K extends keyof typeof self.taskForm>(
        key: K,
        value: (typeof self.taskForm)[K],
      ) {
        self.taskForm[key] = value;
      },
      getGenerateFileData() {
        const { taskId, taskForm } = self;
        const {
          accountType,
          accountNumber,
          routingNumber,
          accountName,
          bankName,
          address,
        } = taskForm;
        return {
          taskId,
          accountType,
          accountNumber,
          routingNumber,
          accountName,
          bankName,
          address: address.getPostData(),
        };
      },
      getPostData() {
        const { taskId, taskForm } = self;
        const {
          accountType,
          accountNumber,
          routingNumber,
          accountName,
          bankName,
          address,
        } = taskForm;
        return {
          taskId,
          taskForm: {
            accountType,
            accountNumber,
            routingNumber,
            accountName,
            bankName,
            documentFile: self.taskForm.documentFile
              ? getSnapshot(self.taskForm.documentFile)
              : undefined,
            address: address.getPostData(),
          },
        };
      },
    };
  });

export type IPTACH = Instance<typeof PTACH>;
export type SPTACH = SnapshotOut<typeof PTACH>;
