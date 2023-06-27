import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  PipelineACH,
  PipelineACHAccountType,
  PipelineTaskItem,
  PipelineTaskItemStatus,
} from '@/types/pipeline';
import { Address } from '@/models/common/Address';

export const PTACHNotBroker = types
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
      bankName: types.maybeNull(types.string),
      address: Address,
      routingNumber: types.maybeNull(types.string),
      accountName: types.maybeNull(types.string),
      accountNumber: types.maybeNull(types.string),
      accountType: types.maybeNull(
        types.union(
          types.literal(PipelineACHAccountType.DEFAULT),
          types.literal(PipelineACHAccountType.CHECKING),
          types.literal(PipelineACHAccountType.SAVINGS),
        ),
      ),
    }),
  })
  .views((self) => ({
    get checkTaskPostForm() {
      return (
        !!self.taskForm.bankName &&
        !!self.taskForm.routingNumber &&
        !!self.taskForm.accountName &&
        !!self.taskForm.accountNumber &&
        !!self.taskForm.accountType &&
        self.taskForm.address.checkAddressValid
      );
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
          address,
        } = taskForm;
        self.taskForm.accountType = accountType;
        self.taskForm.accountNumber = accountNumber;
        self.taskForm.routingNumber = routingNumber;
        self.taskForm.bankName = bankName;
        self.taskForm.accountName = accountName;
        if (address) {
          self.taskForm.address.injectServerData(address);
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
            address: address.getPostData(),
          },
        };
      },
    };
  });

export type IPTACHNotBroker = Instance<typeof PTACHNotBroker>;
export type SPTACHNotBroker = SnapshotOut<typeof PTACHNotBroker>;
