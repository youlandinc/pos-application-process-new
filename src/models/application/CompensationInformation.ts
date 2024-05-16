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

        self.originationPoints = originationPoints
          ? (originationPoints * 1000000) / 10000
          : 1;
        self.processingFee = processingFee ?? 200;
        self.isAdditional = isAdditional ?? false;
        self.additionalInfo = additionalInfo ?? '';
      },
      getPostData() {
        return {
          originationPoints: self.originationPoints
            ? self.originationPoints / 100
            : 0,
          processingFee: self.processingFee,
          isAdditional: self.isAdditional,
          additionalInfo: self.additionalInfo,
        };
      },
    };
  });
