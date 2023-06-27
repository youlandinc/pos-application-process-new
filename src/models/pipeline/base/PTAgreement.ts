import { getSnapshot, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/common/Address';
import { UploadData } from '@/models/common/UploadFile';

import {
  PipelineAgreement,
  PipelineTaskItem,
  PipelineTaskItemStatus,
  PipelineTaskKey,
  PipelineTaskName,
} from '@/types/pipeline';

export const PTAgreement = types
  .model({
    taskId: types.maybe(types.string),
    taskName: PipelineTaskName[PipelineTaskKey.BA],
    taskStatus: types.maybe(
      types.union(
        types.literal(PipelineTaskItemStatus.UNFINISHED),
        types.literal(PipelineTaskItemStatus.FINISHED),
        types.literal(PipelineTaskItemStatus.CONFIRMED),
      ),
    ),
    taskForm: types.model({
      address: Address,
      email: types.maybeNull(types.string),
      title: types.maybeNull(types.string),
      fullName: types.maybeNull(types.string),
      company: types.maybeNull(types.string),
      documentFile: types.maybe(UploadData),
      phoneNumber: types.maybe(types.string),
    }),
  })
  .views((self) => ({
    get checkTaskFormValid() {
      return (
        !!self.taskForm.phoneNumber &&
        !!self.taskForm.email &&
        !!self.taskForm.title &&
        !!self.taskForm.fullName &&
        !!self.taskForm.company &&
        self.taskForm.address.checkAddressValid
      );
    },
    get checkTaskPostForm() {
      return !!self.taskForm.documentFile && this.checkTaskFormValid;
    },
  }))
  .actions((self) => {
    return {
      injectPipelineTaskData(data: PipelineTaskItem<PipelineAgreement>) {
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
          email,
          title,
          fullName,
          company,
          propAddr,
          documentFile,
          phoneNumber,
        } = taskForm;
        self.taskForm.documentFile = documentFile;
        self.taskForm.email = email;
        self.taskForm.title = title;
        self.taskForm.fullName = fullName;
        self.taskForm.company = company;
        self.taskForm.phoneNumber = phoneNumber;
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
        const { email, title, fullName, company, address, phoneNumber } =
          taskForm;
        return {
          taskId,
          email,
          title,
          fullName,
          company,
          phoneNumber,
          propAddr: address.getPostData(),
        };
      },
      getPostData() {
        const { taskId, taskForm } = self;
        const { email, title, fullName, company, address, phoneNumber } =
          taskForm;
        return {
          taskId,
          taskForm: {
            email,
            title,
            fullName,
            company,
            phoneNumber,
            documentFile: self.taskForm.documentFile
              ? getSnapshot(self.taskForm.documentFile)
              : undefined,
            propAddr: address.getPostData(),
          },
        };
      },
    };
  });

export type IPTAgreement = Instance<typeof PTAgreement>;
export type SPTAgreement = SnapshotOut<typeof PTAgreement>;
