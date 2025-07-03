import _uniqueId from 'lodash/uniqueId';
import Router from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { cast, flow, Instance, SnapshotOut, types } from 'mobx-state-tree';

import { AUTO_HIDE_DURATION, TASK_URL_HASH } from '@/constants';
import { Address } from '@/models/common/Address';
import { DBorrower } from '@/models/dashboard/DBorrower';

import {
  AddressData,
  DashboardTaskKey,
  HttpError,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';
import { _fetchDashboardInfo, _fetchLoanTaskList } from '@/requests/dashboard';
import { _fetchLoanChatMessage } from '@/requests';
import {
  ChatMessageItem,
  ChatMessageItemSource,
  RoleEnum,
} from '@/types/account/notification';

interface TaskItem {
  key: DashboardTaskKey;
  value: number;
}

const DEFAULT_ORDER: { [key in DashboardTaskKey]: number } = {
  [DashboardTaskKey.payoff_amount]: 1,
  [DashboardTaskKey.rehab_info]: 2,
  [DashboardTaskKey.square_footage]: 3,
  [DashboardTaskKey.entitlements]: 4,
  [DashboardTaskKey.permits_obtained]: 5,
  [DashboardTaskKey.borrower]: 6,
  [DashboardTaskKey.co_borrower]: 7,
  [DashboardTaskKey.demographics]: 8,
  [DashboardTaskKey.title_escrow]: 9,
  [DashboardTaskKey.holdback_process]: 10,
  [DashboardTaskKey.referring_broker]: 11,
};

const getOrderedTasks = (taskMap: any, filterComplete = false) =>
  Object.entries(DEFAULT_ORDER)
    .filter(([key]) => {
      const hasKey = taskMap.has(key as DashboardTaskKey);
      return filterComplete
        ? hasKey && !taskMap.get(key as DashboardTaskKey)
        : hasKey;
    })
    .map(([key, value]) => ({ key: key as DashboardTaskKey, value }))
    .sort((a, b) => a.value - b.value);

const handleError = (err: HttpError, redirectTo?: string) => {
  const { header, message, variant } = err;
  enqueueSnackbar(message, {
    variant: variant || 'error',
    autoHideDuration: AUTO_HIDE_DURATION,
    isSimple: !header,
    header,
    ...(redirectTo && { onClose: () => (window.location.href = redirectTo) }),
  });
};

export const DashboardInfo = types
  .model({
    propertyAddress: Address,
    additionalAddress: types.array(Address),
    propertyType: types.enumeration(Object.values(LoanPropertyTypeEnum)),
    propertyUnit: types.enumeration(Object.values(LoanPropertyUnitEnum)),
    productCategory: types.enumeration(Object.values(LoanProductCategoryEnum)),
    loanPurpose: types.maybe(types.enumeration(Object.values(LoanPurposeEnum))),
    loading: types.boolean,
    loanId: types.maybe(types.string),
    loanNumber: types.maybe(types.string),
    taskMap: types.map(types.boolean),
    taskOrder: types.array(
      types.model({
        key: types.enumeration(Object.values(DashboardTaskKey)),
        value: types.number,
      }),
    ),
    unReadCount: types.number,
    loanChatMessage: types.array(
      types.model({
        firstName: types.maybeNull(types.string),
        lastName: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        avatar: types.maybeNull(types.string),
        backgroundColor: types.maybeNull(types.string),
        operatorId: types.maybeNull(types.union(types.string, types.number)),
        operationTime: types.maybeNull(types.string),
        content: types.maybeNull(types.string),
        role: types.maybeNull(types.enumeration(Object.values(RoleEnum))),
        docName: types.maybeNull(types.string),
        source: types.maybeNull(
          types.enumeration(Object.values(ChatMessageItemSource)),
        ),
      }),
    ),
    taskBorrower: DBorrower,
  })
  .actions((self) => ({
    findFirst() {
      return getOrderedTasks(self.taskMap)[0]?.key;
    },
    findNextTask(taskOrder: TaskItem[], currentKey?: DashboardTaskKey) {
      const index = taskOrder.findIndex((item) => item.key === currentKey);
      if (index > -1) {
        return taskOrder[index + 1]?.key;
      }

      const originalOrder = Object.entries(DEFAULT_ORDER)
        .filter(([key]) => self.taskMap.has(key as DashboardTaskKey))
        .map(([key, value]) => ({ key: key as DashboardTaskKey, value }))
        .sort((a, b) => a.value - b.value);

      const originalIndex = originalOrder.findIndex(
        (item) => item.key === currentKey,
      );

      for (let i = originalIndex + 1; i < originalOrder.length; i++) {
        if (!self.taskMap.get(originalOrder[i].key)) {
          return originalOrder[i].key;
        }
      }

      return this.findFirst();
    },
    findPrevTask(taskOrder: TaskItem[], currentKey?: DashboardTaskKey) {
      const index = taskOrder.findIndex((item) => item.key === currentKey);
      return taskOrder[index - 1 < 0 ? taskOrder.length - 1 : index - 1]?.key;
    },
    updateTaskOrder() {
      return getOrderedTasks(self.taskMap, true);
    },
    setLoanId(loanId: string) {
      self.loanId = loanId;
    },
    setLoading(loading: boolean) {
      self.loading = loading;
    },
    setLoanTasks(taskMap: any) {
      self.taskMap = taskMap;
      self.taskOrder = cast(this.updateTaskOrder());
    },
    setUnReadCount(count: number) {
      self.unReadCount = count;
    },
    addLoanChatMessage(message: ChatMessageItem) {
      self.unReadCount = 0;
      self.loanChatMessage.push(message);
    },
    async jumpToNextTask(taskKey?: DashboardTaskKey): Promise<void> {
      if (taskKey) {
        self.taskMap.set(taskKey, true);
      }

      const condition = Array.from(self.taskMap.values()).every(
        (value) => value,
      );

      const firstTaskKey = this.findFirst();
      const nextTaskKey = this.findNextTask(self.taskOrder, taskKey);
      if (condition && Router.pathname !== '/dashboard/overview') {
        await Router.push({
          pathname: '/dashboard/overview',
          query: { loanId: self.loanId },
        });
      } else {
        await Router.push({
          pathname: TASK_URL_HASH[nextTaskKey || firstTaskKey],
          query: { loanId: self.loanId },
        });
      }
      self.taskOrder = cast(this.updateTaskOrder());
    },
    async jumpToNextTaskMobile() {
      const taskKey = Object.entries(TASK_URL_HASH).find(
        ([, url]) => url === Router.pathname,
      )?.[0] as DashboardTaskKey;

      const order = Object.entries(DEFAULT_ORDER)
        .filter(([key]) => self.taskMap.has(key as DashboardTaskKey))
        .map(([key, value]) => ({ key: key as DashboardTaskKey, value }))
        .sort((a, b) => a.value - b.value);
      const nextTaskKey = this.findNextTask(order, taskKey);

      const target = nextTaskKey || this.findFirst();
      await Router.push({
        pathname: TASK_URL_HASH[target],
        query: { loanId: self.loanId },
      });
    },
    async backToPrevTaskMobile() {
      const taskKey = Object.entries(TASK_URL_HASH).find(
        ([, url]) => url === Router.pathname,
      )?.[0] as DashboardTaskKey;

      const order = Object.entries(DEFAULT_ORDER)
        .filter(([key]) => self.taskMap.has(key as DashboardTaskKey))
        .map(([key, value]) => ({ key: key as DashboardTaskKey, value }))
        .sort((a, b) => a.value - b.value);
      const prevTaskKey = this.findPrevTask(order, taskKey);
      await Router.push({
        pathname: TASK_URL_HASH[prevTaskKey!],
        query: { loanId: self.loanId },
      });
    },
    injectAdditionalAddressServerData(data: AddressData[]) {
      const list = data.map((item) => {
        const { address, aptNumber, city, state, postcode, lng, lat } = item;

        return Address.create({
          id: _uniqueId('additional_address_'),
          formatAddress: address ?? '',
          state: state ?? '',
          street: '',
          aptNumber: aptNumber ?? '',
          city: city ?? '',
          postcode: postcode ?? '',
          lat: lat ?? void 0,
          lng: lng ?? void 0,
          isValid: Object.keys(item).some((v) => v),
          errors: {},
        });
      });
      self.additionalAddress = cast(list);
    },
  }))
  .actions((self) => {
    const fetchDashboardInfo = flow(function* (loanId: string) {
      if (!loanId || (loanId === self.loanId && !!self.loanNumber)) {
        return;
      }

      self.loading = true;

      const requestList = [
        yield _fetchDashboardInfo(loanId),
        yield _fetchLoanChatMessage(loanId),
      ];

      const [infoRes, chatRes] = yield Promise.allSettled(requestList);
      if (infoRes.status === 'rejected' || chatRes.status === 'rejected') {
        handleError(infoRes.reason as HttpError, '/pipeline');
      }

      if (infoRes.status === 'fulfilled') {
        const {
          data: {
            propertyAddress,
            propertyType,
            propertyUnit,
            loanNumber,
            productCategory,
            loanPurpose,
            additionalAddress,
          },
        } = infoRes.value;
        self.injectAdditionalAddressServerData(additionalAddress || []);
        self.propertyAddress.injectServerData(propertyAddress);
        self.propertyType = propertyType || LoanPropertyTypeEnum.default;
        self.propertyUnit = propertyUnit || LoanPropertyUnitEnum.default;
        self.productCategory = productCategory;
        self.loanPurpose = loanPurpose;
        self.loanId = loanId;
        self.loanNumber = loanNumber ?? '';
      }

      if (chatRes.status === 'fulfilled') {
        const {
          data: { unReadCount, messages },
        } = chatRes.value;
        self.unReadCount = unReadCount;
        self.loanChatMessage = messages;
      }

      self.loading = false;
    });

    const fetchTaskMap = flow(function* (loanId: string) {
      if (!loanId) {
        yield Router.push('/pipeline');
        enqueueSnackbar('Invalid loan ID', {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        return;
      }

      self.setLoanId(loanId);

      try {
        const { data } = yield _fetchLoanTaskList(loanId);
        self.taskMap = data;
        self.taskOrder = cast(self.updateTaskOrder());
      } catch (err) {
        handleError(err as HttpError);
      }
    });

    const fetchChatMessage = flow(function* (loanId: string, cb?: () => void) {
      if (!loanId) {
        yield Router.push('/pipeline');
        enqueueSnackbar('Invalid loan ID', {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        return;
      }

      self.setLoanId(loanId);
      try {
        const {
          data: { unReadCount, messages },
        } = yield _fetchLoanChatMessage(loanId);
        self.unReadCount = unReadCount;
        self.loanChatMessage = messages;
        cb?.();
      } catch (err) {
        handleError(err as HttpError);
      }
    });

    return {
      fetchDashboardInfo,
      fetchChatMessage,
      fetchTaskMap,
    };
  });

export type IDashboardInfo = Instance<typeof DashboardInfo>;
export type SDashboardInfo = SnapshotOut<typeof DashboardInfo>;
