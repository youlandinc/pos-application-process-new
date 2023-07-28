import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { FixPurpose } from './FixPurpose';
import { FixProperty } from './FixProperty';

import { StartingState, VariableName } from '@/types/enum';
import { FixStartingData } from '@/types/application/fix';

export const FixStarting = types
  .model({
    purpose: FixPurpose,
    property: FixProperty,
    state: types.frozen<StartingState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectServerData(value: FixStartingData) {
      const {
        propertyNumber,
        propAddr,
        propertyType,
        propertyUnit,
        isConfirm,
      } = value;
      self.purpose.values.propertyNumber = propertyNumber;
      self.purpose.values.address.injectServerData(propAddr);

      self.property.values.propertyType = propertyType;
      self.property.values.propertyUnit = propertyUnit;
      self.property.values.isConfirm = isConfirm;
    },
    getPostData(): Variable<FixStartingData> {
      const {
        purpose: {
          values: {
            propertyNumber,
            address: { formatAddress, state, aptNumber, city, postcode },
          },
        },
        property: {
          values: { propertyType, propertyUnit, isConfirm },
        },
      } = self;
      return {
        name: VariableName.starting,
        type: 'json',
        value: {
          propertyNumber,
          propertyType,
          propertyUnit,
          isConfirm,
          propAddr: {
            address: formatAddress,
            state,
            aptNumber,
            city,
            postcode,
          },
        },
      };
    },
  }));

export type IFixStarting = Instance<typeof FixStarting>;
export type SFixStarting = SnapshotOut<typeof FixStarting>;
