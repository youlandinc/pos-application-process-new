import { cast, types } from 'mobx-state-tree';
import { OwnerData, SOwnerData } from '@/models/common/OwnerData';
import _uniqueId from 'lodash/uniqueId';

export const Questionnaire = types
  .model({
    licenses: types.array(OwnerData),
  })
  .actions((self) => {
    return {
      injectServerData(data: SOwnerData[]) {
        data.map((item) => {
          item.id = _uniqueId('owner_');
        });
        self.licenses = cast(data);
      },
      changeFieldValue<T extends keyof SOwnerData>(
        index: number,
        key: keyof SOwnerData,
        value: SOwnerData[T],
      ) {
        self.licenses[index][key] = value;
      },
      addOwner(owner: SOwnerData) {
        self.licenses.push(owner);
      },
      removeOwner(index: number) {
        self.licenses.splice(index, 1);
      },
      getData() {
        return self.licenses;
      },
    };
  })
  .views((self) => ({
    get isListValidate() {
      return self.licenses.every((item) => {
        return (
          item.firstName &&
          item.lastName &&
          item.ssn &&
          item.birthday &&
          item.state &&
          item.licenseType &&
          item.license
        );
      });
    },
  }));
