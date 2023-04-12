import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import {
  _fetchTaskItemStatus,
  STaskItemsStatusResponse,
  STaskItemStatus,
} from '@/requests/dashboard';

export const DTask = types
  .model({
    paymentStatus: types.union(
      types.literal(STaskItemStatus.COMPLETE),
      types.literal(STaskItemStatus.UNDONE),
      types.literal(STaskItemStatus.FAIL),
      types.literal(STaskItemStatus.PROCESSING),
    ),
    taskInitialized: types.boolean,
  })
  .actions((self) => {
    return {
      injectTaskItemStatus(
        // this just for payment async get result , because stripe give me the results first, so this will show fail or success(complete).
        status: STaskItemsStatusResponse,
      ) {
        self.paymentStatus = status.payment;
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
    };
  })
  .actions((self) => {
    const fetchTaskItemStatus = flow(function* (processId = '') {
      if (!processId) {
        return;
      }
      try {
        const res = yield _fetchTaskItemStatus(processId);
        self.injectTaskItemStatus(res.data);
        self.taskInitialized = true;
      } catch (e) {
        console.log(e);
      }
    });
    return {
      fetchTaskItemStatus,
    };
  });

export type IDTask = Instance<typeof DTask>;
export type SDTask = SnapshotOut<typeof DTask>;
