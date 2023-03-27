import { flow, Instance, types } from 'mobx-state-tree';
import { _fetchTaskItemStatus } from '@/requests/dashboard';

export const DashboardTask = types
  .model({
    paymentStatus: types.union(
      types.literal('complete'),
      types.literal('undone'),
      types.literal('fail'),
      types.literal('processing'),
    ),
    taskInitialized: types.boolean,
  })
  .actions((self) => {
    return {
      injectTaskItemStatus(
        // this just for payment async get result , because stripe give me the results first, so this will show fail or success(complete).
        status: Record<string, 'complete' | 'undone' | 'fail' | 'processing'>,
      ) {
        self.paymentStatus = status['payment'];
      },
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: typeof self[K],
      ) {
        self[key] = value;
      },
    };
  })
  .actions((self) => {
    const fetchTaskItemStatus = flow(function* (processId = '') {
      if (!processId) return;
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

export type IDashboardTask = Instance<typeof DashboardTask>;
