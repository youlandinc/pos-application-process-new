import { types } from 'mobx-state-tree';
import { CompensationInformationFromData } from '@/types';

export const CompensationInformation = types
  .model({
    originationPoints: types.maybe(types.number),
    processingFee: types.maybe(types.number),
    isAdditional: types.maybe(types.boolean),
    additionalInfo: types.maybe(types.string),
  })
  .actions((self) => {
    return {
      changeFieldValue<T extends keyof typeof self>(
        key: T,
        value: (typeof self)[T],
      ) {
        self[key] = value;
      },
      injectServerData(data: CompensationInformationFromData) {
        const {
          originationPoints,
          processingFee,
          isAdditional,
          additionalInfo,
        } = data;

        self.originationPoints = originationPoints ?? void 0;
        self.processingFee = processingFee ?? void 0;
        self.isAdditional = isAdditional ?? void 0;
        self.additionalInfo = additionalInfo ?? void 0;
      },
      getPostData() {
        return {
          originationPoints: self.originationPoints,
          processingFee: self.processingFee,
          isAdditional: self.isAdditional,
          additionalInfo: self.additionalInfo,
        };
      },
    };
  });
