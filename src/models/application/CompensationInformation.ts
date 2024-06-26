import { cast, types } from 'mobx-state-tree';
import { CompensationInformationFromData } from '@/types';
import { AdditionalFee, SAdditionalFee } from '@/models/common/AdditionalFee';
import _uniqueId from 'lodash/uniqueId';

export const CompensationInformation = types
  .model({
    originationPoints: types.maybe(types.number),
    processingFee: types.maybe(types.number),
    isAdditional: types.maybe(types.boolean),
    additionalInfo: types.maybe(types.string),
    additionalFees: types.array(AdditionalFee),
  })
  .actions((self) => {
    return {
      changeFieldValue<T extends keyof typeof self>(
        key: T,
        value: (typeof self)[T],
      ) {
        self[key] = value;
      },
      changeFeeFieldValue<T extends keyof SAdditionalFee>(
        index: number,
        key: keyof SAdditionalFee,
        value: SAdditionalFee[T],
      ) {
        self.additionalFees[index][key] = value;
      },
      addAdditionalFee(data: SAdditionalFee) {
        self.additionalFees.push(data);
      },
      removeAdditionalFee(index: number) {
        self.additionalFees.splice(index, 1);
      },
      injectServerData(data: CompensationInformationFromData) {
        const {
          originationPoints,
          processingFee,
          isAdditional,
          additionalInfo,
          additionalFees,
        } = data;

        self.originationPoints = originationPoints
          ? (originationPoints * 1000000) / 10000
          : 1;
        self.processingFee = processingFee ?? 200;
        self.isAdditional = isAdditional ?? false;
        self.additionalInfo = additionalInfo ?? '';

        if (additionalFees && additionalFees.length > 0) {
          additionalFees.map((item) => {
            return (item.id = _uniqueId('additional_fee'));
          });
        }

        self.additionalFees = cast(additionalFees ?? []);
      },
      getPostData() {
        return {
          originationPoints: self.originationPoints
            ? self.originationPoints / 100
            : 0,
          processingFee: self.processingFee,
          isAdditional: self.isAdditional,
          additionalInfo: self.additionalInfo,
          additionalFees: self.additionalFees,
        };
      },
    };
  })
  .views((self) => ({
    get isListValidate() {
      return self.additionalFees.every((item) => {
        return item.value && item.fieldName;
      });
    },
  }));
