import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Address } from '@/models/common/Address';

import {
  PipelineAgreement,
  PipelineLicenseType,
  PipelineTaskItem,
  PipelineTaskItemStatus,
} from '@/types/pipeline';

export const PTAgreementNotBroker = types
  .model({
    taskId: types.maybe(types.string),
    taskName: types.maybe(types.string),
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
      phone: types.maybe(types.string),
      license: types.maybe(
        types.union(
          types.literal(PipelineLicenseType.DRE_LICENSE),
          types.literal(PipelineLicenseType.NMLS_LICENSE),
        ),
      ),
    }),
  })
  .views((self) => ({
    get checkTaskPostForm() {
      return (
        !!self.taskForm.phone &&
        !!self.taskForm.email &&
        !!self.taskForm.title &&
        !!self.taskForm.fullName &&
        !!self.taskForm.company &&
        !!self.taskForm.license &&
        self.taskForm.address.checkAddressValid
      );
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
        const { email, title, fullName, company, propAddr, phone, license } =
          taskForm;
        self.taskForm.email = email;
        self.taskForm.title = title;
        self.taskForm.fullName = fullName;
        self.taskForm.company = company;
        self.taskForm.phone = phone;
        self.taskForm.license = license;
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
      getPostData() {
        const { taskId, taskForm } = self;
        const { email, title, fullName, company, address, phone, license } =
          taskForm;
        return {
          taskId,
          taskForm: {
            email,
            title,
            fullName,
            company,
            phone,
            license,
            propAddr: address.getPostData(),
          },
        };
      },
    };
  });

export type IPTAgreementNotBroker = Instance<typeof PTAgreementNotBroker>;
export type SPTAgreementNotBroker = SnapshotOut<typeof PTAgreementNotBroker>;
