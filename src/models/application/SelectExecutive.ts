import { types } from 'mobx-state-tree';
import { SelectExecutiveFormData } from '@/types';

export const SelectExecutive = types
  .model({
    executiveId: types.maybe(types.string),
    executiveName: types.maybe(types.string),
  })
  .actions((self) => ({
    injectServerData(data: SelectExecutiveFormData) {
      const { executiveId, executiveName } = data;
      self.executiveId = executiveId ?? '';
      self.executiveName = executiveName ?? '';
    },
    getPostData() {
      return {
        executiveId: self.executiveId,
        executiveName: self.executiveName,
      };
    },
    changeFieldValue<K extends keyof SelectExecutiveFormData>(
      field: K,
      value: SelectExecutiveFormData[K],
    ) {
      self[field] = value;
    },
  }));
