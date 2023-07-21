import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { FixedPurpose } from './FixedPurpose';
import { FixedProperty } from './FixedProperty';

import { StartingState, VariableName } from '@/types/enum';
import { FixedStartingData } from '@/types/application/fixed';

export const FixedStarting = types
  .model({
    purpose: FixedPurpose,
    property: FixedProperty,
    state: types.frozen<StartingState>(),
  })
  .actions((self) => ({
    changeState(state: typeof self.state) {
      self.state = state;
    },
    injectServerData(value: FixedStartingData) {
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
    getPostData(): Variable<FixedStartingData> {
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

export type IFixedStarting = Instance<typeof FixedStarting>;
export type SFixedStarting = SnapshotOut<typeof FixedStarting>;
